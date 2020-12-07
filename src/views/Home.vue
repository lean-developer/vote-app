<template>
    <b-container>
      <div v-if="master">
        <div v-if="master.members">
          <div v-for="m in master.members" :key="m.id">
            <user-chips :name=m.name></user-chips>
          </div>
        </div>
      </div>
      <new-vote-comp></new-vote-comp>
      <new-member-comp @createMember="onCreateMember"></new-member-comp>
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
    console.log('NewMember ' + membername);  
    if (this.master) {
      const newMember: Member | undefined = await MasterService.createMemberOfMaster(this.master.id, membername);
      if (newMember) {
        const savedMaster: Master = this.master;
        savedMaster.members.push(newMember);
        await this.$store.commit(StoreActions.SaveMaster, savedMaster);
        console.log('Push Member', membername, savedMaster);
      }
    }
  }
}
</script>