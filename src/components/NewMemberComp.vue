<template>
  <b-container>
    <div>
      <b-row class="mt-3 mb-2">
        <b-col>
          <b-input-group>
            <b-input type="text" v-model="username"></b-input>
            <b-button variant="primary" @click="onCreate()"><b-icon-plus></b-icon-plus></b-button>
          </b-input-group>
          <div class="ml-2" style="text-align: left">
           <small>Team-Member anlegen</small>
          </div>
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
export default class NewMemberComp extends Vue {
    private username: string = '';

    async created() {
      console.log('NewMemberComp created...')
    }

    @Emit('createMember')
    async onCreate() {
        const newMember: string = this.username;
        if (newMember) {
          this.username = '';
          return newMember;
        }
    }
}
</script>

