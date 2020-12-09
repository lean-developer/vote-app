<template>
  <b-container>
    <div>
      <div v-if="vote">
           <b-card class="mt-2 mb-2">
           <b-card-title>{{vote.name}}<b-badge class="ml-2 mb-2" pill variant="info">13</b-badge>
            </b-card-title>
              <b-card-text style="text-align: right;">
              </b-card-text>
              <b-button v-if="isOpen" variant="success" @click="onStartVote()">Schätzrunde starten</b-button>
          </b-card>
          <div v-if="isOpen">
                <div v-for="m in master.members" :key="m.id">
                    <div>{{m.name}}</div>
                </div>
          </div>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';
import StoreService from '@/domain/api/store.service';
import { Master } from '@/domain/models/master';

@Component({
  components: {
  },
})
export default class Estimate extends Vue {
    private voteId!: number;
    private vote: Vote | undefined;

    async created() {
        this.voteId = +this.$route.params.voteId;
        this.vote = this.getStoreVote();
    }

    getStoreVote(): Vote | undefined {
        for(let v of this.master.votes) {
            if(v.id === this.voteId) {
                return v;
            }
        }
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.vote);
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
