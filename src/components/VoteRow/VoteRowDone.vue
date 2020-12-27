<template>
    <div class="ml-3 mr-3">
        <b-row v-if="vote">
            <b-button variant="danger" class="btn-w row-mb row-mr" disabled><span class="points">{{StoryPoints}}</span></b-button>
            <b-col class="row-mb row-mr vote-row vote-name" :style=rowState>
                <b-row>
                    <b-col @click="onClickVote()">
                        <div class="text-head mt-1">
                            {{vote.name}}
                        </div>
                    </b-col>
                </b-row>
                <b-row>
                    <div class="text-sub">
                        <em class="ml-3">{{vote.status}}</em>
                    </div>
                </b-row>
            </b-col>
            <b-button class="row-mb" variant="secondary" @click="onArchiv()"><i class="fas fa-archive"></i></b-button>
            <b-modal v-model="showVotingModal" title="Schätzungen" ok-only>
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
    </div>
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

    created() {
        let voteMemberVotes: MemberVote[] | undefined;
        if (this.memberVoteMap.has(this.vote?.id)) {
            voteMemberVotes = this.memberVoteMap.get(this.vote?.id);
        }
        if (voteMemberVotes) {
            this.memberVotes = voteMemberVotes;
        }
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

    onClickVote() {
        this.$router.push("/estimate/" + this.vote.id);
    }

    @Emit('archivVote')
    onArchiv() {
        return this.vote;
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

     get rowState() {
        return { 
            'color': 'white',
            'background-color': '#6c757d',
            'cursor': 'pointer'
        }
     }    
}
</script>

<style scoped>
    .points {
         font-family: 'Krona One', sans-serif;
         font-size: 14px;
         font-stretch: ultra-expanded;
    }
    .btn-w {
        width: 60px;
    }
</style>

