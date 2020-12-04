<template>
  <b-container>
      <div>
          Vote {{voteId}}
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {
  },
})
export default class Vote extends Vue {
    private voteId!: number;
    private name: string = '';

  created() {
    this.voteId = +this.$route.params.voteId
  }
}
</script>
