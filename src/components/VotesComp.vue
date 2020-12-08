<template>
  <b-container>
      <div v-if="votes">
        <div v-for="v in votes" :key="v.id">
        <b-row>
            <b-button class="row-mb row-mr" :variant=checkState @click="onCheck(v)"><i class="fas fa-check"></i></b-button>
            <b-col class="row-mb row-mr vote-row vote-name">
                <b-link :href="`/estimate/${v.id}`">
                    {{v.name}} ({{v.id}})
                </b-link>
            </b-col>
            <b-button class="row-mb" variant="light" @click="onDelete(v)"><i class="fas fa-ban"></i></b-button>
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

    onCheck(vote: Vote) {
    }

    get checkState(): string {
        return 'success';
    }

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
        border-radius: 8px;
        padding-top: 1rem;
        padding-bottom: 1rem;
        background-color: rgb(237, 237, 237);
    }
    .row-mb {
        margin-bottom: 5px;
    }
    .row-mr {
        margin-right: 3px;
    }
    .vote-name {
        text-align: left;
    }
</style>

