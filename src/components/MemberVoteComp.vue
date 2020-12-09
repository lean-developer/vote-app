<template>
    <div>
        <b-row>
            <!--
            <b-button :disabled=disabled class="row-mb row-mr" size="lg" variant="success" @click="onExpand()"><i class="fas fa-angle-double-down"></i></b-button>
            -->
            <b-col class="row-mb row-mr vote-row vote-name" :style=rowState @click="onExpand()">
                <div style="display: inline;" class="text-head">
                    {{vote.name}} 
                </div>
                <div class="text-sub" >
                    <em>{{vote.status}}</em>
                </div>
            </b-col>
            <b-col v-if="showPoints" cols="2" @click="onExpand()" class="row-mb row-mr vote-row vote-name align-items-center" :style=rowState>
                <div class="center">
                    <p>{{points}}</p>
                </div>
            </b-col>
            <b-button :disabled=disabled  :style=saveBtnState class="row-mb" variant="outline-success" @click="onSave()"><i class="fas fa-check"></i></b-button>
        </b-row>
        <b-row v-if="showVoting">
            <member-voting @clickPoints=onClickPoints></member-voting>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';
import VoteService from '@/domain/api/vote.service';
import MemberVoting from '@/components/MemberVoting.vue';

@Component({
  components: {
      MemberVoting
  },
})
export default class MemberVoteComp extends Vue {
    @Prop({ required: true }) vote!: Vote;
    private showVoting: boolean = false;
    private points: string = '';
    @Model() disabled: boolean = false;

    created() {
        if (this.isOpen) {
            this.disabled = true
        }
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.vote);
    }

    get isRunning(): boolean {
        return VoteService.isRunning(this.vote);
    }

    get showPoints(): boolean {
        return (this.isRunning && this.points.length > 0);
    }

    onExpand() {
        if (this.isRunning && !this.disabled) {
            this.showVoting = !this.showVoting;
        }
    }

    onSave() {
        this.showVoting = false;
        this.disabled = true;
    }

    onClickPoints(p: string) {
        this.points = p;
    }

    get saveBtnState() {
        if (this.isRunning) {
            if (this.disabled) {
                return { 
                    'color': 'rgba(255, 255, 255, 0.872)',
                    'background-color': '#6fd387',
                    'cursor': 'auto'
                }
            }
        }
    }

    get rowState() {
        if (this.isRunning) {
            if (this.disabled) {
                return { 
                    'color': 'rgba(255, 255, 255, 0.872)',
                    'background-color': '#6fd387',
                    'cursor': 'auto'
                }    
            }
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
                'cursor': 'auto'
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
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
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
    .center { 
        height: 40px;
        color: rgb(249, 245, 130);
        font-weight: bolder;
        position: relative;
    }
    .center p {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>
