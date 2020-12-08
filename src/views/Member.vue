<template>
  <b-container>
      MEMBER
      <b-button variant="outline-info" @click="onMemberLogout()">Logout</b-button>
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

@Component({
  components: {
  },
})
export default class Member extends Vue {
    async onMemberLogout() {
        const initStoreModel: StoreModel = new StoreModel();
        await this.$store.commit(StoreActions.SaveMember, initStoreModel.member);
        if (this.$store.getters.master) {
            this.$router.push({ name: 'Estimates' })
        }
        else {
            this.$router.push({ name: 'Login' })
        }
    }
}
</script>
