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
                            <b-progress class="bcolor mt-2 mb-2" :value=VotingInPercent max=100 height="7px" :variant=ProgressVariant></b-progress>
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
            <b-button v-if="showClose" :disabled=Disabled variant="light" class="bcolor row-mb btn-w-sm" @click="onClose()"><i class="fas fa-ban"></i></b-button>
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
    private showClose: boolean = false;

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
            this.showClose = !this.showClose;
        }
    }

    @Emit('closeVote')
    onClose() {
        return this.vote;
    }

    get rowState() {
        return { 
            'color': 'white',
            'background-color': 'var(--main-green-3)',
            'cursor': 'pointer'
        }    
    }
}
</script>


<style scoped>
    .bcolor {
        background-color: var(--main-green-3),
    }
    .btn-w-sm {
        width: 40px;
    }
</style>

