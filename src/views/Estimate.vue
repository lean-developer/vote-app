<template>
  <b-container>
    <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
    <div v-if="!loading">
      <div v-if="vote">
          <b-row :key=componentKey>
              <b-button variant="light" @click="onBack()"><i class="fas fa-chevron-left"></i></b-button>
            <div class="head-status" :style=stateColor>
                    <em>{{vote.status}}</em>
            </div>
          </b-row>
           <b-card class="text-left" bg-variant="dark" text-variant="white">
           <b-card-title class="ml-2">{{vote.name}}
               <b-badge v-if="Points" class="ml-2 mb-2" pill variant="info">{{Points}}</b-badge>
            </b-card-title>
              <b-card-text style="text-align: right;">
              </b-card-text>
              <b-button v-if="isOpen" class="ml-2" variant="success" @click="onStartVote()">Planning Poker starten</b-button>
              <b-button v-if="isRunning && hasMemberVotes" class="ml-2" variant="secondary" @click="onNeuSchaetzen()">neu schätzen</b-button>
              <b-button v-if="isDone" class="ml-2" variant="secondary" @click="onNeuSchaetzen()">neu schätzen</b-button>
              <b-button v-if="isRunning" class="ml-2" :disabled=!hasPoints variant="success" @click="onSaveStoryPoints()">Abschließen</b-button>
          </b-card>
          <div v-if="MemberVoteResult">
              <b-card bg-variant="success" text-variant="white">
                <div v-for="mv in MemberVoteResult.memberVotes" :key="mv.member.id">
                    <estimate-row-comp :key=componentKey :memberVote=mv :isDone=isDone @acceptVote=onAcceptVote></estimate-row-comp>
                </div>
              </b-card>
          </div>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service';
import MemberService from '@/domain/api/member.service';
import { Vote } from '@/domain/models/vote';
import EstimateRowComp from '@/components/EstimateRowComp.vue';
import StoreService from '@/domain/api/store.service';
import SocketService from '@/domain/api/socket.service';
import { Master } from '@/domain/models/master';
import { MemberVoteValue } from '@/domain/models/memberVoteValue';
import { MemberVoteResult } from '@/domain/models/memberVoteResult';
import { Member } from '@/domain/models/member';
import { Socket } from 'vue-socket.io-extended';
import { MemberVote } from '@/domain/models/memberVote';

@Component({
  components: {
      EstimateRowComp
  },
})
export default class Estimate extends Vue {
    private componentKey: number = 0;
    private voteId!: number;
    private vote: Vote | undefined;
    private loading: boolean = false;
    private memberVoteResult!: MemberVoteResult | undefined;
    private points: string = '';

    async created() {
        this.voteId = +this.$route.params.voteId;
        await this.init();
    }

    async init() {
        this.vote = this.getStoreVote();
        if (!this.vote) {
            console.warn('Vote is undefined; not found in store (master.votes)!', this.master.votes);
        }
        if (this.vote?.points) {
            this.points = this.vote.points;
        }
        this.loading = true;
        await this.loadMemberVoteResult();
        this.loading = false;
    }

    forceRerender() {
        this.componentKey += 1;
    }

    onBack() {
        this.$router.push({ name: 'Estimates' });
    }

    get Points(): string {
        return this.points;
    }

    get hasPoints(): boolean {
        return this.points.length > 0;
    }

    get hasMemberVotes(): boolean {
        if (!this.MemberVoteResult) {
            return false;
        }
        if (this.MemberVoteResult.memberVotes && this.MemberVoteResult.memberVotes.length > 0) {
            return true;
        }
        return false;
    }

    private hasMemberVoted(member: Member): boolean {
        if (!this.MemberVoteResult) {
            return false;
        }
         for (let mv of this.MemberVoteResult.memberVotes) {
            if (mv.member) {
                if (mv.member.id === member.id) {
                    return true;
                }
            }
        }
        return false;
    }

    @Socket('memberVoteChanged')
    async onMemberVoteChanged(result: any) {
        let currentMember: Member = result[0];
        let currentVote: Vote = result[1];
        let newPoints: string = result[2];
        this.loading = true;
        if (this.master && this.vote) {
            if (this.vote.id === currentVote.id) {
                this.updateChangedVote(currentMember, currentVote, newPoints);
                this.forceRerender();
            }
        }
        this.loading = false;
    }

    updateChangedVote(currentMember: Member, changedVote: Vote, newPoints: string) {
        let newMemberVotes: MemberVote[] = [];
        if (!this.memberVoteResult) {
            return;
        }
        for(let mv of this.memberVoteResult.memberVotes) {
            if (mv.member) {
                if (mv.member.id === currentMember.id) {
                    console.log('Update ', changedVote.name, newPoints);
                    mv.points = newPoints;
                }
            }
            newMemberVotes.push(mv);
        }
        this.memberVoteResult.memberVotes = newMemberVotes;
    }

    onAcceptVote(points: string) {
        this.points = points;
    }

    async onNeuSchaetzen() {
        if (this.vote) {
            // 1) memberVotes löschen!
            const isDeleted: boolean | undefined = await MemberService.deleteMemberVotesByVote(this.vote);
            if (isDeleted) {
                // 2) Vote: Status auf running setzen und StoryPoints löschen!
                const newStateVote: Vote | undefined = await VoteService.setRunningAndDeletePoints(this.vote);
                if (newStateVote) {
                    this.vote = newStateVote;
                    this.points = '';
                    // 3) Clients benachrichtigen
                    SocketService.emitMasterVoteChanged(this.master, this.vote);
                    // 4) Store updaten
                    await StoreService.reloadMember();
                    // 5) Members mit leeren Schätzungen anzeigen
                    this.deleteMemberVotes();
                    this.forceRerender();
                }
            }
        }
    }

    deleteMemberVotes() {
        if (this.memberVoteResult) {
            this.memberVoteResult.memberVotes = [];
            this.setUnvotedMembers();
        }
    }

    async onSaveStoryPoints() {
        if (this.vote) {
            await VoteService.setDone(this.vote, this.points);
            await StoreService.reloadMemberVotesIsRunning();
            SocketService.emitMasterVoteChanged(this.master, this.vote);
            this.$router.push({ name: 'Estimates' });
        }
    }

    getStoreVote(): Vote | undefined {
        for(let v of this.master.votes) {
            if(v.id === this.voteId) {
                return v;
            }
        }
    }

    async loadMemberVoteResult(): Promise<void> {
        if (this.vote) {
            const result = await MemberService.getMemberVotesResult(this.vote);
            if (result) {
                this.memberVoteResult = result;
                console.log('LoadMemberVoteResult: ', this.memberVoteResult);
                this.setUnvotedMembers();
            }
        }
    }

    setUnvotedMembers() {
        for (let m of this.master.members) {
            if (this.hasMemberVoted(m)) {
                continue;
            }
            if (this.memberVoteResult) {
                let unvotedMemberVote: MemberVote = { vote: this.vote, member: m, points: '', note: '' };
                this.memberVoteResult.memberVotes.push(unvotedMemberVote);
            }
        }
    }

    get MemberVoteResult(): MemberVoteResult | undefined {
        return this.memberVoteResult;
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.vote);
    }

    get isRunning(): boolean {
        return VoteService.isRunning(this.vote);
    }

    get isDone(): boolean {
        return VoteService.isDone(this.vote);
    }

    get master(): Master {
        return this.$store.getters.master;
    }

    get isLogin(): boolean {
        return StoreService.isLogin;
    }

    async onStartVote() {
        if (!this.vote) {
            return;
        }
        if (VoteService.isOpen(this.vote)) {
            const newVote = await VoteService.setRunning(this.vote);
            if (newVote) {
                SocketService.emitMasterVoteChanged(this.master, this.vote);
                this.vote = newVote;
                await StoreService.reloadMaster();
            }
        }
    }

     get stateColor() {
        if (this.isRunning) {
            return { 
                'color': '#28a745'
            }    
        }
        if (this.isDone) {
            return {
                'color': '#0275d8'
            }
        }
        if (this.isOpen) {
            return {
                'color': '#d9534f'
            }
        }
        return {
            'color': 'black'
        }
     }
}
</script>

<style scoped>
    .head-status {
        margin-top: 0.5rem;
        text-align: left;
        font-size: 14px;
        font-weight: 700;
    }
</style>