<template>
    <b-container>
      <b-card
        title="Neue Abstimmung"
        img-src="https://picsum.photos/600/300/?image=25"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 20rem;"
        class="mb-2"
      >
        <b-card-text>
          <b-input type="text" v-model="abstimmung"></b-input>
        </b-card-text>

        <b-button href="#" variant="primary" @click="onStartVote()">Abstimmung starten</b-button>
      </b-card>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
  },
})
export default class Home extends Vue {
  private abstimmung: string = ''

  onStartVote() {
    console.log('VOTE', this.abstimmung);
    this.$router.push({ name: 'Vote', params: { voteId: "1" } })
  }
}
</script>
