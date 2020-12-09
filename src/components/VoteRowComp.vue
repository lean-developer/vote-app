<template>
    <b-row v-if="vote">
        <b-button class="row-mb row-mr" :disabled=disabled :variant=stateVariant @click="onCheck()"><i class="fas fa-check"></i></b-button>
        <b-col class="row-mb row-mr vote-row vote-name" :style=rowState @click="onClickVote()">
            <!--
            <b-link :style=linkColor :href="`/estimate/${vote.id}`">
                {{vote.name}} ({{vote.id}})
            </b-link>
            -->
            <div class="text-head">
                 {{vote.name}} ({{vote.id}})
            </div>
            <div class="text-sub">
                <em>{{vote.status}}</em>
            </div>
        </b-col>
        <b-button :disabled=disabled class="row-mb" variant="light" @click="onDelete()"><i class="fas fa-ban"></i></b-button>
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
    @Model() disabled: boolean = false;

    get stateVariant(): string {
        if (this.vote) {
             if (VoteService.isOpen(this.vote)) {
                 return 'success';
             }
             else if (this.isRunning) {
                 this.disabled = true;
                 return 'outline-success';
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

    onClickVote() {
        if (this.isOpen || this.isRunning) {
            this.$router.push("/estimate/" + this.vote.id);
        }
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.vote);
    }

    get isRunning(): boolean {
        return VoteService.isRunning(this.vote);
    }

    get rowState() {
        if (this.isRunning) {
            return { 
                'color': 'white',
                'background-color': '#28a745',
                'cursor': 'pointer'
            }    
        }
        if (this.isOpen) {
            return { 
                'color': 'rgb(59, 59, 59)',
                'background-color': 'rgb(237, 237, 237)',
                'cursor': 'pointer'
        }
        }
        return { 
            'color': 'darkgrey',
            'background-color': 'rgb(237, 237, 237)',
            'cursor': 'auto'
        }
    }
}
</script>

<style scoped>
    .vote-row {
        border-radius: 8px;
        padding-top: 1rem;
        padding-bottom: 1rem;
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
    .text-head {
        font-size: 16px;
        font-weight: bold;
    }
    .text-sub {
        font-size: 10px;
    }
</style>

