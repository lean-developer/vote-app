<template>
  <b-container>
       <b-card
        title="Neues Teammitglied"
        img-src="https://picsum.photos/600/300/?image=24"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2">
        <b-card-text>
          <b-input type="text" v-model="username"></b-input>
        </b-card-text>
        <b-button href="#" variant="primary" @click="onCreate()">Speichern</b-button>
      </b-card>
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
export default class NewUserComp extends Vue {
    private username: string = '';

    async created() {
      console.log('NewUserComp created...')
    }

    @Emit('createMember')
    async onCreate() {
       return this.username;
    }
}
</script>

