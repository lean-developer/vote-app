<template>
    <b-container>
      <div v-if="users">
         <div v-for="u in users" :key="u">
           <user-chips :name=u></user-chips>
         </div>
      </div>
      <new-vote-comp></new-vote-comp>
      <new-user-comp @createMember="onCreateMember"></new-user-comp>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';
import UserChips from '@/components/UserChips.vue';
import NewVoteComp from '@/components/NewVoteComp.vue';
import NewUserComp from '@/components/NewUserComp.vue';

@Component({
  components: {
    UserChips,
    NewVoteComp,
    NewUserComp,
  },
})
export default class Home extends Vue {
  private users: string[] = [];

  onCreateMember(username: string) {
    console.log('NewMember ' + username);  
    this.users.push(username);
  }
}
</script>