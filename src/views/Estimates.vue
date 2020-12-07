<template>
  <b-container>
      <new-vote-comp @createVote="onCreateVote"></new-vote-comp>
      <div v-if="master.votes">
          <votes-comp :votes=master.votes @deleteVote="onDeleteVote" @archivVote="onArchivVote"></votes-comp>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service';
import StoreService from '@/domain/api/store.service';
import { Vote } from '@/domain/models/vote';
import VotesComp from '@/components/VotesComp.vue';
import NewVoteComp from '@/components/NewVoteComp.vue';
import { DeleteResult } from '@/domain/models/deleteResult';
import { Master } from '@/domain/models/master';

@Component({
  components: {
      VotesComp,
      NewVoteComp,
  },
})
export default class Estimates extends Vue {
    
    @Model() get master(): Master {
        return this.$store.getters.master;
    }

    async onDeleteVote(vote: Vote) {
        const deleteResult: DeleteResult | undefined = await VoteService.deleteVote(vote.id);
        if (deleteResult && deleteResult.affected) {
            if (deleteResult.affected > 0) {
                await StoreService.reloadMaster();
            }
        }
    }

    async onCreateVote(votename: string) {
        if (StoreService.isLogin) {
        const newVote: Vote | undefined = await VoteService.createVoteForMaster(this.master.id, votename);
        if (newVote) {
            await StoreService.reloadMaster();
        }
        }
    }

    onArchivVote(vote: Vote) {
        console.log('ARCHIV', vote.name);
    }
}
</script>
