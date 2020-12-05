<template>
  <b-container>
      <div v-if="vote">
          Schätzung {{vote.name}} ({{vote.id}})
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';

@Component({
  components: {
  },
})
export default class VoteComp extends Vue {
     @Prop({ required: true }) vote!: Vote

    async created() {
      console.log('VoteComp created...')
    }
}
</script>

