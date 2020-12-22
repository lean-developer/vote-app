<template>
    <b-row v-if="vote">
        <b-button v-if="ShowCheckButton" class="btn-min row-mb row-mr" :disabled=Disabled :variant=stateVariant @click="onCheck()"><i class="fas fa-check"></i></b-button>
        <b-button v-if="isDone" variant="danger" class="btn-min row-mb row-mr" disabled>{{StoryPoints}}</b-button>
        <b-col class="row-mb row-mr vote-row vote-name" :style=rowState @click="onClickVote()">
            <div class="text-head">
                 {{vote.name}}
            </div>
            <div class="text-sub">
                <em>{{vote.status}}</em>
            </div>
        </b-col>
        <b-col v-if="isRunning && hasMemberVotes" class="row-mb row-mr vote-row" :style="rowStateVoting" cols="2" @click="onClickShowVoting()">
            <div v-if="memberVotes" class="mt-2">
                <span class="text-voted">{{VotingInPercent}} %</span>
            </div>
        </b-col>
        <b-button v-if="isNew" :disabled=Disabled class="row-mb" variant="light" @click="onDelete()"><i class="fas fa-ban"></i></b-button>
        <b-button v-if="isOpen" :disabled=Disabled class="row-mb" variant="secondary" @click="onClickVote()"><i class="fas fa-angle-double-right"></i></b-button>
        <b-button v-if="isDone" class="row-mb" variant="secondary" @click="onArchiv()"><i class="fas fa-archive"></i></b-button>
        <b-modal v-model="showVotingModal" title="bisherige Schätzungen" ok-only>
            <div v-for="mv in MyMemberVotes" :key="mv.member.id">
                <b-row class="mt-1">
                    <b-col class="ml-4" cols="4">
                        {{mv.member.name}}
                    </b-col> 
                    <b-col style="text-align: center">
                        {{mv.points}}
                    </b-col>
                </b-row>
            </div>
        </b-modal>
    </b-row>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';
import VoteService from '@/domain/api/vote.service';
import { Member } from '@/domain/models/member';
import { MemberVote } from '@/domain/models/memberVote';
import StoreService from '@/domain/api/store.service';

@Component({
  components: {
  },
})
export default class VoteRowComp extends Vue {
    @Prop({ required: true }) vote!: Vote;
    @Prop({ required: true }) memberVoteMap!: Map<number, MemberVote[]>;
    private memberVotes: MemberVote[] = [];
    private disabled: boolean = false;
    private showVotingModal: boolean = false;
    private touchstartX!: number;
    private touchstartY!: number;
    private touchendX!: number;
    private touchendY!: number;

    created() {
        let voteMemberVotes: MemberVote[] | undefined;
        if (this.memberVoteMap.has(this.vote?.id)) {
            voteMemberVotes = this.memberVoteMap.get(this.vote?.id);
        }
        if (voteMemberVotes) {
            console.log('VoteMemberVotes', voteMemberVotes);
            this.memberVotes = voteMemberVotes;
        }
    }

    mounted() {
        window.addEventListener('touchstart', this.touchstartEventHandler, false);
        window.addEventListener('touchend', this.touchendEventHandler, false);
    }

    destroyed() {
        window.removeEventListener('touchstart', this.touchstartEventHandler, false);
        window.removeEventListener('touchend', this.touchendEventHandler, false);
    }

    touchstartEventHandler(event: TouchEvent) {
        this.touchstartX = event.changedTouches[0].screenX;
        this.touchstartY = event.changedTouches[0].screenY;
    }

    touchendEventHandler(event: TouchEvent) {
        this.touchendX = event.changedTouches[0].screenY;
        this.touchstartY = event.changedTouches[0].screenY;
        this.handleGesture();
    }

    handleGesture() {
        // TODO ?
    }

    get hasMemberVotes(): boolean {
        return this.memberVotes.length > 0;
    }

    onClickShowVoting() {
        this.showVotingModal = !this.showVotingModal;
                }

    get MyMemberVotes(): MemberVote[] {
        return this.memberVotes;
    }

    get VotingInPercent(): string {
        if (StoreService.isMaster && this.hasMemberVotes) {
             const membersLen: number = StoreService.master.members.length;
             const votesLen: number = this.MyMemberVotes.length;
             return Math.round((100 / membersLen * votesLen)).toString();
        }
        return '';
    }

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

    get StoryPoints(): string {
        if (this.vote && this.vote.points) {
            return this.vote.points;
        }
        return '';
    }

    get Disabled(): boolean {
        return this.disabled;
    }

    get ShowCheckButton(): boolean {
        if (this.isOpen || this.isNew) {
            return true;
        }
        return false;
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
        if (this.isOpen || this.isRunning || this.isDone) {
            this.$router.push("/estimate/" + this.vote.id);
        }
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.vote);
    }

    get isRunning(): boolean {
        return VoteService.isRunning(this.vote);
    }

    get isDone(): boolean {
        return VoteService.isDone(this.vote);
    }

    get isNew(): boolean {
        return this.vote.status === '';
    }

    get rowStateVoting() {
         if (this.isRunning) {
            return { 
                'color': 'darkgrey',
                'background-color': 'whitesmoke',
                'cursor': 'pointer'
            }    
        }
         return { 
            'color': 'darkgrey',
            'background-color': 'rgb(237, 237, 237)',
            'cursor': 'auto'
        }
    }

    get rowState() {
         if (this.isDone) {
            return { 
                'color': 'white',
                'background-color': '#6c757d',
                'cursor': 'pointer'
            }    
        }
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
    .text-voted {
        color: rgb(255, 64, 64);
        font-weight: 900;
        font-size: 14px;
        white-space: nowrap;
    }
    .btn-min {
        width: 50px;
    }
</style>

