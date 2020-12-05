<template>
  <b-container>
      <div>
          <votes-comp :votes=votes></votes-comp>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';
import VotesComp from '@/components/VotesComp.vue';

@Component({
  components: {
      VotesComp
  },
})
export default class Estimates extends Vue {
    @Model() private votes: Vote[] | undefined

    async created() {
      this.votes = await VoteService.getVotes();
    }
}
</script>
