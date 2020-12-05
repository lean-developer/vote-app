<template>
  <b-container>
      <div v-if="votes">
        <div v-for="v in votes" :key="v.id">
        <b-row class="vote-row">
            <b-col cols="6" class="vote-name">
                <b-link :href="`/estimate/${v.id}`">{{v.name}} ({{v.id}})</b-link>
            </b-col>
            <b-col>
                <b-link href="" @click="onArchiv(v)"><small>Archivieren</small></b-link>
            </b-col>
            <b-col>
                <b-link href="" @click="onDelete(v)"><small>Löschen</small></b-link>
            </b-col>
        </b-row>
        </div>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';

@Component({
  components: {
  },
})
export default class VotesComp extends Vue {
    @Prop({ required: true }) votes!: Vote[]

    @Emit('deleteVote')
    onDelete(vote: Vote) {
        return vote;
    }

    @Emit('archivVote')
    onArchiv(vote: Vote) {
        return vote;
    }
}
</script>

<style scoped>
    .vote-row {
        border-radius: 10px;
        border: 2px solid #adadad;
        margin-bottom: 5px;
        padding-top: 6px;
        padding-bottom: 6px;
        background-color: rgb(226, 226, 226);
    }
    .vote-name {
        text-align: left;
    }
</style>

