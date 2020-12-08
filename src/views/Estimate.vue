<template>
  <b-container>
    <div>
      <div v-if="vote">
           <b-card class="mt-2 mb-2">
           <b-card-title>{{vote.name}}<b-badge class="ml-2 mb-2" pill variant="info">13</b-badge>
            </b-card-title>
              <b-card-text style="text-align: right;">
              </b-card-text>
              <b-button variant="success" @click="onStartVote()">Starten</b-button>
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
    private isOpen: boolean = false;

    async created() {
        this.voteId = +this.$route.params.voteId;
        this.vote = this.getStoreVote();
        this.isOpen = this.vote?.status === 'OPEN';
    }

    getStoreVote(): Vote | undefined {
        for(let v of this.master.votes) {
            if(v.id === this.voteId) {
                return v;
            }
        }
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
        const newVote = await VoteService.setOpen(this.vote);
        if (newVote) {
            this.isOpen = true;
            await StoreService.reloadMaster();
        }
    }
}
</script>
