<template>
  <b-container>
      <div v-if="votes">
        <div v-for="v in votes" :key="v.id">
          <b-link :href="`/estimate/${v.id}`">{{v.name}} ({{v.id}})</b-link> |
          <b-link href="" @click="onArchiv(v)"><small>Archivieren</small></b-link> |
          <b-link href="" @click="onDelete(v)"><small>Löschen</small></b-link>
        </div>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';

@Component({
  components: {
  },
})
export default class VotesComp extends Vue {
    @Prop({ required: true }) votes!: Vote[]
 
    created() {
      console.log('VotesComp created');
    }

    onDelete(vote: Vote) {
        console.log('Delete ' + vote.id);
    }

    onArchiv(vote: Vote) {
        console.log('Archiv ' + vote.id);
    }
}
</script>

