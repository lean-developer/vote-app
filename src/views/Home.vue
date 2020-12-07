<template>
    <b-container>
      <div v-if="master">
        <new-member-comp @createMember="onCreateMember"></new-member-comp>
        <div v-if="master.members">
          <div v-for="m in master.members" :key="m.id">
            <user-chips :member=m></user-chips>
          </div>
        </div>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator';
import MasterService from '@/domain/api/master.service'
import { Vote } from '@/domain/models/vote';
import UserChips from '@/components/UserChips.vue';
import NewVoteComp from '@/components/NewVoteComp.vue';
import NewMemberComp from '@/components/NewMemberComp.vue';
import { Master } from '@/domain/models/master';
import { StoreActions } from '../store';
import { Member } from '@/domain/models/member';
import VoteService from '@/domain/api/vote.service';
import StoreService from '@/domain/api/store.service';

@Component({
  components: {
    UserChips,
    NewVoteComp,
    NewMemberComp,
  },
})
export default class Home extends Vue {
  private users: string[] = [];

  @Model() get master(): Master {
    return this.$store.getters.master
  }

  async onCreateMember(membername: string) {
    if (StoreService.isLogin) {
      const newMember: Member | undefined = await MasterService.createMemberOfMaster(this.master.id, membername);
      if (newMember) {
        await StoreService.reloadMaster();
      }
    }
  } 
}
</script>