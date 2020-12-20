<template>
  <b-container>
      <new-vote-comp v-if="IsMaster" @createVote="onCreateVote"></new-vote-comp>
      <div v-if="Master.votes">
          <div v-for="v in SortedVotes" :key="v.id">
            <vote-row-comp class="ml-1 mr-1" :key=componentKey 
                :vote=v 
                :memberVoteMap=MyMemberVoteMap
                @checkVote="onCheckVote"
                @deleteVote="onDeleteVote" 
                @archivVote="onArchivVote">
            </vote-row-comp>
          </div>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service';
import StoreService from '@/domain/api/store.service';
import { Vote } from '@/domain/models/vote';
import NewVoteComp from '@/components/NewVoteComp.vue';
import VoteRowComp from '@/components/VoteRowComp.vue';
import { DeleteResult } from '@/domain/models/deleteResult';
import { Master } from '@/domain/models/master';
import { Member } from '@/domain/models/member';
import { Socket } from 'vue-socket.io-extended';
import { MasterResult } from '../domain/models/masterResult';
import { MemberVoteResult } from '../domain/models/memberVoteResult';
import { MemberVote } from '@/domain/models/memberVote';

@Component({
  components: {
      NewVoteComp,
      VoteRowComp
  },
})
export default class Estimates extends Vue {
    private masterResult!: MasterResult | undefined;
    private componentKey: number = 0;
    private memberVoteMap: Map<number, MemberVote[]> = new Map();
    
    async created() {
        if (this.IsMaster) {
            this.masterResult = await VoteService.getVotesMasterResult(this.Master.id);
            if (this.masterResult) {
                this.initRunningVotesVotedMembers();
                this.forceRerender();
            }
        }
    }

    initRunningVotesVotedMembers() {
        for (let v of this.Master.votes) {
            let memberVoteResult: MemberVoteResult | undefined = this.getVoteResults(v.id);
            if (memberVoteResult) {
                this.memberVoteMap.set(v.id, memberVoteResult.memberVotes);
            }
        }
    }

    get MyMemberVoteMap(): Map<number, MemberVote[]> {
        return this.memberVoteMap;
    }

    getVoteResults(voteId: number): MemberVoteResult | undefined {
        if (this.masterResult) {
            for (let res of this.masterResult.memberVoteResults) {
                if (res.vote.id === voteId) {
                    return res;
                }
            }
        }
    }

    get Master(): Master {
        return this.$store.getters.master;
    }

    get IsMaster(): boolean {
        return this.Master.uid !== '';
    }

    forceRerender() {
        this.componentKey += 1;
    }

    async onDeleteVote(vote: Vote) {
        const deleteResult: DeleteResult | undefined = await VoteService.deleteVote(vote.id);
        if (deleteResult && deleteResult.affected) {
            if (deleteResult.affected > 0) {
                await StoreService.reloadMaster();
            }
        }
    }

    get SortedVotes(): Vote[] | undefined {
        return this.Master.votes.sort((a, b) => 
            (this.getStatusSortOrder(a) > this.getStatusSortOrder(b)) ? 1 : (
                    (this.getStatusSortOrder(a) < this.getStatusSortOrder(b) ? -1 : 0)
                ));
    }

    getStatusSortOrder(vote: Vote): number {
        if (VoteService.isOpen(vote)) {
            return 1;
        }
        if (VoteService.isRunning(vote)) {
            return 2;
        }
        if (VoteService.isDone(vote)) {
            return 3;
        }
        return 0;
    }

    @Socket('memberStateChanged')
    onMemberLogin(result: any) {
        console.log('memberStateChanged', result);
    }

    @Socket('memberVoteChanged')
    onMemberVoteChanged(result: any) {
        let currentMember: Member = result[0];
        let currentVote: Vote = result[1];
        let newPoints: string = result[2];
        let currentMemberVote: MemberVote = { points: newPoints, note: '', member: currentMember, vote: currentVote };
        if (!this.memberVoteMap.has(currentVote.id)) {
            // Vote für die bisher noch keiner geschätzt hat
            this.memberVoteMap.set(currentVote.id, []);
        }
        if (this.memberVoteMap.has(currentVote.id)) {
            let myMemberVotes: MemberVote[] | undefined = this.memberVoteMap.get(currentVote.id);
            if (myMemberVotes) {
                if (myMemberVotes.indexOf(currentMemberVote) > 0) {
                    // bereits geschätzt; Points aktualisieren
                    // TODO
                }
                else {
                    // MemberVote aufnehmen
                    myMemberVotes.push(currentMemberVote);
                     this.forceRerender();
                }
            }
        }
        console.log('## Socket.memberVoteChanged'); 
    }

    async onCreateVote(votename: string) {
        if (StoreService.isLogin) {
        const newVote: Vote | undefined = await VoteService.createVoteForMaster(this.Master.id, votename);
        if (newVote) {
            await StoreService.reloadMaster();
        }
        }
    }

    async onCheckVote(vote: Vote) {
        if (VoteService.isClose(vote)) {
            await VoteService.setOpen(vote);
            await StoreService.reloadMaster();
        }
        else if (VoteService.isOpen(vote)) {
            await VoteService.setClose(vote);
            await StoreService.reloadMaster();
        }
    }

    async onVoteOpen(vote: Vote) {
        await VoteService.setOpen(vote);
    }

    onArchivVote(vote: Vote) {
        console.log('ARCHIV', vote.name);
    }
}
</script>
