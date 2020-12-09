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
          <div v-if="votes">
               <div v-for="v in votes" :key="v.id">
                   <member-vote-comp class="ml-4 mr-4" :vote=v></member-vote-comp>
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
import MasterService from '@/domain/api/master.service';
import MemberVoteComp from '@/components/MemberVoteComp.vue';

@Component({
  components: {
      MemberVoteComp
  },
})
export default class Member extends Vue {
    @Model() private votes: Vote[] = [];

    async created() {
        if (this.isMaster) {
            this.setMemberVotes(this.master.votes);        
        }
        else {
            await this.loadMasterVotes();
        }
    }

    setMemberVotes(allVotes: Vote[]) {
        this.votes = [];
        for (let v of allVotes) {
            if (VoteService.isOpen(v) || VoteService.isRunning(v)) {
                this.votes.push(v);
            }
        }
    }

    async loadMasterVotes() {
        const master: Master | undefined = await MasterService.getMasterByUid(this.member.uid);
        if (master) {
            this.setMemberVotes(master.votes);
        }
    }

    async loadMemberVotes() {
        // TODO
    }

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

    get isMaster(): boolean {
        if (this.master && this.master.uid) {
            return true;
        }
        return false;
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