<template>
    <b-row v-if="vote">
        <b-button class="row-mb row-mr" :variant=stateVariant @click="onCheck()"><i class="fas fa-check"></i></b-button>
        <b-col class="row-mb row-mr vote-row vote-name">
            <b-link :href="`/estimate/${vote.id}`">
                {{vote.name}} ({{vote.id}})
            </b-link>
        </b-col>
        <b-button class="row-mb" variant="light" @click="onDelete()"><i class="fas fa-ban"></i></b-button>
    </b-row>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';
import VoteService from '@/domain/api/vote.service';

@Component({
  components: {
  },
})
export default class VoteRowComp extends Vue {
    @Prop({ required: true }) vote!: Vote;

    get stateVariant(): string {
        if (this.vote) {
             if (VoteService.isOpen(this.vote)) {
                 return 'success';
             }
        }
        return 'light';
    }

    @Emit('deleteVote')
    onDelete() {
        return this.vote;
    }

    @Emit('archivVote')
    onArchiv() {
        return this.vote;
    }

    @Emit('checkVote')
    onCheck() {
        return this.vote;
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

