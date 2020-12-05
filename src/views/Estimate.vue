<template>
  <b-container>
      <div>
          <vote-comp :vote=vote></vote-comp>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';
import VoteComp from '@/components/VoteComp.vue';

@Component({
  components: {
      VoteComp
  },
})
export default class Estimate extends Vue {
    private voteId!: number;
    @Model() private vote: Vote | undefined

    async created() {
        this.voteId = +this.$route.params.voteId;
        if (this.voteId) {
            this.vote = await VoteService.getVote(this.voteId);
        }
    }
}
</script>
