<template>
  <b-container>
    <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
    <div v-if="!loading">
      <div v-if="vote">
          <b-row>
              <b-button variant="light" @click="onBack()"><i class="fas fa-chevron-left"></i></b-button>
            <div class="head-status">
                    <em><small>{{vote.status}}</small></em>
            </div>
          </b-row>
           <b-card class="mb-4 text-left" bg-variant="dark" text-variant="white">
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
          <div v-if="isOpen">
                 <b-card v-if="MembersOhneVote" bg-variant="secondary" text-variant="white" class="mb-4" title="offen">
                    <div v-for="m in MembersOhneVote" :key="m.id">
                        <estimate-row-comp :member=m></estimate-row-comp>
                    </div>
                </b-card>
          </div>
          <div v-if="MemberVoteResult && !isOpen">
              <div>
                  <b-card v-if="hasMemberVotes" bg-variant="success" text-variant="white" class="mb-4" title="geschätzt">
                    <div v-for="mv in MemberVoteResult.memberVotes" :key="mv.member.id">
                        <estimate-row-comp :memberVote=mv :isDone=isDone @acceptVote=onAcceptVote></estimate-row-comp>
                    </div>
                  </b-card>
                  <b-card v-if="MembersOhneVote" bg-variant="secondary" text-variant="white" class="mb-4" title="offen">
                      <div v-for="m in MembersOhneVote" :key="m.id">
                          <estimate-row-comp :member=m></estimate-row-comp>
                      </div>
                  </b-card>
              </div>
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
import { Master } from '@/domain/models/master';
import { MemberVoteValue } from '@/domain/models/memberVoteValue';
import { MemberVoteResult } from '@/domain/models/memberVoteResult';
import { Member } from '@/domain/models/member';

@Component({
  components: {
      EstimateRowComp
  },
})
export default class Estimate extends Vue {
    private voteId!: number;
    private vote: Vote | undefined;
    private loading: boolean = false;
    private memberVoteResult!: MemberVoteResult;
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

    onBack() {
        this.$router.go(-1);
    }

    get Points(): string {
        return this.points;
    }

    get hasPoints(): boolean {
        return this.points.length > 0;
    }

    get MembersOhneVote(): Member[] {
        let membersOhneVote: Member[] = [];
        for (let m of this.master.members) {
            if (this.hasMemberVoted(m)) {
                continue;
            }
            membersOhneVote.push(m);
        }
        return membersOhneVote;
    }

    get hasMemberVotes(): boolean {
        if (this.MemberVoteResult.memberVotes && this.MemberVoteResult.memberVotes.length > 0) {
            return true;
        }
        return false;
    }

    private hasMemberVoted(member: Member): boolean {
         for (let mv of this.MemberVoteResult.memberVotes) {
            if (mv.member) {
                if (mv.member.id === member.id) {
                    return true;
                }
            }
        }
        return false;
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
                    // 3) Store updaten
                    await StoreService.reloadMember();
                    // 4) Stories anzeigen          
                    this.$router.go(0); // relaod Page
                }
            }
        }
    }

    async onSaveStoryPoints() {
        if (this.vote) {
            await VoteService.setDone(this.vote, this.points);
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
            }
        }
    }

    get MemberVoteResult(): MemberVoteResult {
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
                this.vote = newVote;
                await StoreService.reloadMaster();
            }
        }
    }
}
</script>

<style scoped>
    .head-status {
        margin-top: 1rem;
        text-align: left;
    }
</style>