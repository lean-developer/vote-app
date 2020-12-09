<template>
    <b-row>
        <b-col class="row-mb row-mr vote-row vote-name" :style=rowState>
            <div class="text-head">
                 {{vote.name}} 
            </div>
            <div class="text-sub">
                <em>{{vote.status}}</em>
            </div>
        </b-col>
        <b-button class="row-mb" variant="outline-success"><i class="fas fa-check"></i></b-button>
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
export default class MemberVoteComp extends Vue {
    @Prop({ required: true }) vote!: Vote;

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
