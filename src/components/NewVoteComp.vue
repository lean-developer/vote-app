<template>
  <b-container>
    <div>
      <b-row class="mt-3 mb-2">
        <b-col>
          <b-input-group>
            <b-input type="text" v-model="abstimmung"></b-input>
            <b-button variant="primary" @click="onCreate()"><b-icon-plus></b-icon-plus></b-button>
          </b-input-group>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';

@Component({
  components: {
  },
})
export default class NewVoteComp extends Vue {
    private abstimmung: string = '';

    async created() {
      console.log('NewVoteComp created...')
    }

    @Emit('createVote')
    async onCreate() {
        const newVote: string = this.abstimmung;
        if (newVote) {
          this.abstimmung = '';
          return newVote;
        }
    }
}
</script>

