<template>
    <div>
        <b-row>
            <!--
            <b-button :disabled=Disabled class="row-mb row-mr" size="lg" variant="success" @click="onExpand()"><i class="fas fa-angle-double-down"></i></b-button>
            -->
            <b-col class="row-mb row-mr vote-row vote-name" :style=rowState @click="onExpand()">
                <div style="display: inline;" class="text-head">
                    {{vote.name}} 
                </div>
                <div class="text-sub" >
                    <em>{{vote.status}}</em>
                </div>
            </b-col>
            <b-col v-if="ShowPoints || isDone" cols="2" @click="onExpand()" class="row-mb row-mr vote-row vote-name align-items-center" :style=rowState>
                <div v-if="isDone" class="points-done">
                    <p>{{Points}}</p>
                </div>
                <div v-if="!isDone" class="points">
                    <p>{{Points}}</p>
                </div>
            </b-col>
            <b-button v-if="ShowPoints" :disabled=Disabled  :style=saveBtnState class="row-mb" variant="outline-success" @click="onSave()"><i class="fas fa-check"></i></b-button>
        </b-row>
        <b-row v-if="showVoting">
            <member-voting @clickPoints=onClickPoints></member-voting>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';
import { SaveVotePoints } from '@/domain/models/saveVotePoints';
import VoteService from '@/domain/api/vote.service';
import MemberService from '@/domain/api/member.service';
import MemberVoting from '@/components/MemberVoting.vue';
import { MemberVote } from '@/domain/models/memberVote';
import { Member } from '@/domain/models/member';

@Component({
  components: {
      MemberVoting
  },
})
export default class MemberVoteComp extends Vue {
    @Prop({ required: true }) vote!: Vote;
    private showVoting: boolean = false;
    private points: string = '';
    private disabled: boolean = false;

    created() {
        if (this.isOpen) {
            this.disabled = true
        }
    }

    get MemberVotes(): MemberVote[] | undefined {
        return this.$store.getters.memberVotes;
    }

    get Disabled(): boolean {
        return this.disabled;
    }

    get Points(): string {
        return this.points;
    }

    get Vote(): Vote {
        return this.vote;
    }

    mounted() {
        if (this.vote) {
            let memberVote: MemberVote | undefined = this.getMemberVote(this.Vote);
            if (memberVote) {
                this.points = memberVote.points;
            } 
        } else {
            console.warn('Vote undefined!');
        }
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.Vote);
    }

    get isRunning(): boolean {
        return VoteService.isRunning(this.Vote);
    }

    getMemberVote(v: Vote): MemberVote | undefined {
        if (this.MemberVotes && this.MemberVotes.length > 0) {
            for (let mv of this.MemberVotes) {
                if (mv.vote) {
                    if (mv.vote.id === v.id) {
                        return mv;
                    }
                }
            }
        }
    }

    get isDone(): boolean {
        return VoteService.isDone(this.vote);
    }

    get ShowPoints(): boolean {
        if (!this.isRunning) {
            return false;
        }
        if (!this.points) {
            return false;
        }
        return (this.points.length > 0);
    }

    onExpand() {
        if (this.isRunning && !this.disabled) {
            this.showVoting = !this.showVoting;
        }
    }

    @Emit('save')
    onSave(): SaveVotePoints {
        this.showVoting = false;
        this.disabled = true;
        let saveVotePoints = {
            vote: this.vote,
            points: this.points 
        }
        return saveVotePoints;
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
        if (this.isDone) {
            return { 
                'color': 'darkgrey',
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
    .points { 
        height: 40px;
        color: rgb(249, 245, 130);
        font-weight: 900;
        position: relative;
    }
    .points-done {
        height: 40px;
        color: darkgray;
        font-weight: 900;
        position: relative;
    }
    .points p {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
    .points-done p {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
    }
</style>
