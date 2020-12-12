<template>
  <b-container>
      <new-vote-comp v-if="IsMaster" @createVote="onCreateVote"></new-vote-comp>
      <div v-if="Master.votes">
          <div v-for="v in SortedVotes" :key="v.id">
            <vote-row-comp class="ml-1 mr-1" :vote=v 
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

@Component({
  components: {
      NewVoteComp,
      VoteRowComp
  },
})
export default class Estimates extends Vue {
    
    get Master(): Master {
        return this.$store.getters.master;
    }

    get IsMaster(): boolean {
        return this.Master.uid !== '';
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
