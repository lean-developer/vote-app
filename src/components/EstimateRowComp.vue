<template>
    <b-container>
        <div class="mt-1" v-if="memberVote">
            <b-row class="m">
                <b-col class="left m-success" :style="rowState" cols="6">
                    <span>{{memberVote.member.name}}</span>
                </b-col>
                <b-col class="right m-success" :style="rowState" cols="4">
                    <span>{{Points}}</span>
                </b-col>
                <b-col class="right" cols="2">
                    <b-button v-if="ShowAcceptButton" variant="light" @click=onAcceptVote><i class="fas fa-chevron-right"></i></b-button>
                </b-col>
            </b-row>
        </div>
    </b-container>
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
import { Master } from '@/domain/models/master';

@Component({
  components: {
  },
})
export default class EstimateRowComp extends Vue {
    @Prop({ required: false }) memberVote!: MemberVote;
    @Prop({ required: false }) member!: Member;
    @Prop({ required: false }) isDone!: boolean;

    @Emit('acceptVote')
    onAcceptVote() {
        return this.memberVote.points;
    }

    get ShowAcceptButton(): boolean {
        return !this.isDone && this.memberVote.points.length > 0;
    }

    get Points(): string {
        if (this.hasVoted) {
            return this.memberVote.points;
        }
        return '-';
    }

    get hasVoted(): boolean {
        return this.memberVote.points.length > 0;
    }

    get rowState() {
         if (this.hasVoted) {
            return { 
                'color': 'green'
            }    
        }
        return { 
            'color': 'darkgray'
        }   
    }
}
</script>

<style scoped>
    .m {
        padding: 0.4rem;
        background-color: whitesmoke;
        border: darkgray;
        border-radius: 10px;
    }
    .m-success {
        margin-top: 5px;
        font-weight:800;
        font-size: 18px;
    }
    .left {
        text-align: left;
    }
    .right {
        text-align: right;
    }
</style>

