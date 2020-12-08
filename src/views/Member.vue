<template>
  <b-container>
      <div v-if="member">
          <b-row class="head">
              <b-col class="ml-4" style="text-align: left;">
                  <h4>{{member.name}}</h4>
              </b-col>
              <b-col style="text-align: right;" class="mb-1">
                  <b-button pill variant="light" @click="onMemberLogout()"><i class="fas fa-sign-out-alt"></i></b-button>
              </b-col>
              <div class="line"></div>
          </b-row>
          <div v-if="master">
               <div v-for="v in master.votes" :key="v.id">
                   <div>
                    {{v.name}}
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
import StoreModel from '@/store/storeModel';
import { StoreActions } from '@/store';
import { StoreMember } from '@/domain/models/storeMember';

@Component({
  components: {
  },
})
export default class Member extends Vue {
    async onMemberLogout() {
        const initStoreModel: StoreModel = new StoreModel();
        await this.$store.commit(StoreActions.SaveMember, initStoreModel.member);
        if (this.master) {
            this.$router.push({ name: 'Estimates' })
        }
        else {
            this.$router.push({ name: 'Login' })
        }
    }

    get member(): StoreMember {
        return this.$store.getters.member;
    }

    get master(): Master {
        return this.$store.getters.master;
    }
}
</script>

<style scoped>
    .head {
        margin-top: 2rem;
        margin-right: 2rem;
    }
    .line {
        margin-left: 2rem;
        margin-right: 1rem;
        margin-bottom: 1rem;
        width: 100%;
        border-bottom: 1px solid rgb(181, 181, 181);
        position: relative;
    }
</style>