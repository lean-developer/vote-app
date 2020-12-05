<template>
  <b-container>
      <div>
          <votes-comp :votes=votes @deleteVote="onDeleteVote" @archivVote="onArchivVote"></votes-comp>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';
import VotesComp from '@/components/VotesComp.vue';
import { DeleteResult } from '@/domain/models/deleteResult';

@Component({
  components: {
      VotesComp
  },
})
export default class Estimates extends Vue {
    @Model() private votes: Vote[] | undefined

    async created() {
      await this.loadVotes();
    }

    async loadVotes() {
        this.votes = await VoteService.getVotes();
    }

    async onDeleteVote(vote: Vote) {
        console.log('DELETE', vote.name);
        const deleteResult: DeleteResult | undefined = await VoteService.deleteVote(vote.id);
        if (deleteResult && deleteResult.affected) {
            if (deleteResult.affected > 0) {
                await this.loadVotes();
            }
        }
    }

    onArchivVote(vote: Vote) {
        console.log('ARCHIV', vote.name);
    }
}
</script>
