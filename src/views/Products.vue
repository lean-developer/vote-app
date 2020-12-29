<template>
  <b-container>
      <new-product-comp v-if="IsMaster" @createProduct="onCreateProduct"></new-product-comp>
      <div v-if="Master.products">
          <!--
          <div v-for="v in SortedVotes" :key="v.id">
            <vote-row-comp class="ml-1 mr-1" :key=componentKey 
                :vote=v 
                :memberVoteMap=MyMemberVoteMap
                @checkVote="onCheckVote"
                @deleteVote="onDeleteVote" 
                @closeVote="onCloseVote"
                @archivVote="onArchivVote">
            </vote-row-comp>
          </div>
          -->
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
import { mutations } from '@/store';
import NewProductComp from '@/components/NewProductComp.vue';

@Component({
  components: {
      NewProductComp
  },
})
export default class Products extends Vue {

    async created() {
        mutations.setSiteCaption('Projekte');
    }

    get Master(): Master {
        return this.$store.getters.master;
    }

    get IsMaster(): boolean {
        return this.Master.uid !== '';
    }

     async onCreateProduct(productname: string) {
        if (StoreService.isLogin) {
            /*
            const newVote: Vote | undefined = await VoteService.createVoteForMaster(this.Master.id, votename);
            if (newVote) {
                // State auf Open setzen (TODO: braucht man den State=New überhaupt noch?)
                await VoteService.setOpen(newVote);
                await StoreService.reloadMaster();
            }
            */
        }
    }
}
</script>
