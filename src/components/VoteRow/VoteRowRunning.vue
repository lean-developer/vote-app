<template>
    <div>
        <b-row v-if="vote">
            <b-col class="row-mb row-mr vote-row vote-name" :style=rowState>
                <b-row>
                    <b-col @click="onClickVote()">
                         <div v-if="!IsVoting" class="text-head mt-1 mb-1">
                            {{vote.name}}
                        </div>
                        <div v-if="IsVoting" class="text-head">
                            {{vote.name}}
                        </div>
                    </b-col>
                    <b-col v-if="IsVoting" cols="2" style="text-align: right;" @click="onClickShowVoting()">
                        <i class="fas fa-user-friends"></i>
                    </b-col>
                    <b-col v-if="IsVotingDone" cols="2" style="text-align: right;" class="mb-1 mt-1" @click="onClickShowVoting()">
                        <i class="fas fa-check"></i>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col @click="onClickVote()">
                        <div v-if="IsVoting">
                            <b-progress class="mt-2 mb-2" style="background-color: darkgray;"  :value=VotingInPercent max=100 height="5px" :variant=ProgressVariant></b-progress>
                        </div>
                    </b-col>
                </b-row>
            </b-col>
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
            <b-button v-if="showDelete" :disabled=Disabled style="background-color: rgb(200, 200, 200);" variant="light" class="row-mb" @click="onDelete()"><i style="color: red;" class="fas fa-ban"></i></b-button>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';
import VoteService from '@/domain/api/vote.service';
import VoteRowDone from '@/components/VoteRow/VoteRowDone.vue';
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
    private showDelete: boolean = false;

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

    get ProgressVariant(): string {
        if (this.VotingInPercent >= 100) {
            return "success";
        }
        return "warning";
    }

    get IsVoting(): boolean {
        return this.hasMemberVotes && (this.VotingInPercent < 100);
    }

    get IsVotingDone(): boolean {
        return this.hasMemberVotes && (this.VotingInPercent >= 100);
    }

    get VotingInPercent(): number {
        if (StoreService.isMaster && this.hasMemberVotes) {
             const membersLen: number = StoreService.master.members.length;
             const votesLen: number = this.MyMemberVotes.length;
             return Math.round((100 / membersLen * votesLen));
        }
        return 0;
    }

    get Disabled(): boolean {
        return this.disabled;
    }

    onClickVote() {
        if (this.IsVoting || this.IsVotingDone) {
            this.$router.push("/estimatechart/" + this.vote.id);
        }
        else {
            // TODO: Löschen-Button anzeigen?
            this.showDelete = !this.showDelete;
        }
    }

    get rowStateVoting() {
        return { 
            'color': 'darkgrey',
            'background-color': 'whitesmoke',
            'cursor': 'pointer'
        }    
    }

    get rowState() {
        return { 
            'color': 'white',
            'background-color': '#28a745',
            'cursor': 'pointer'
        }    
    }
}
</script>


