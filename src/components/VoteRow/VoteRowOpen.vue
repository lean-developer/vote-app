<template>
    <div>
        <b-row v-if="vote">
            <b-button :disabled=Disabled class="btn-w bcolor row-mb mr-1" variant="light" @click="onStartVote()"><i style="color: green;" class="fas fa-play"></i></b-button>
            <b-col class="bcolor row-mb row-mr vote-row vote-name" :style=rowState>
                <b-row>
                    <b-col @click="onClickVote()">
                         <div v-if="!IsVotingDone && !IsVoting" class="text-head mt-1">
                            {{vote.name}}
                        </div>
                        <div v-if="!IsVotingDone && IsVoting" class="text-head">
                            {{vote.name}}
                        </div>
                        <div v-if="IsVotingDone" class="text-head mt-1">
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
            <b-button :disabled=Disabled variant="light" class="bcolor row-mb" @click="onDelete()"><i style="color: red;" class="fas fa-ban"></i></b-button>
        </b-row>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Model, Prop, Emit } from 'vue-property-decorator';
import { Vote } from '@/domain/models/vote';
import VoteService from '@/domain/api/vote.service';
import VoteRowDone from '@/components/VoteRow/VoteRowDone.vue';
import VoteRowOpen from '@/components/VoteRow/VoteRowOpen.vue';
import VoteRowRunning from '@/components/VoteRow/VoteRowRunning.vue';
import { Member } from '@/domain/models/member';
import { MemberVote } from '@/domain/models/memberVote';
import StoreService from '@/domain/api/store.service';
import SocketService from '@/domain/api/socket.service';
import { Master } from '@/domain/models/master';

@Component({
  components: {
      VoteRowDone,
      VoteRowRunning,
      VoteRowOpen
  },
})
export default class VoteRowComp extends Vue {
    @Prop({ required: true }) vote!: Vote;
    private memberVotes: MemberVote[] = [];
    private disabled: boolean = false;

    get stateVariant(): string {
        if (this.vote) {
             if (VoteService.isOpen(this.vote)) {
                 return 'success';
             }
        }
        return 'light';
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

    @Emit('checkVote')
    onCheck() {
        return this.vote;
    }

    onClickVote() {
        this.$router.push("/estimate/" + this.vote.id);
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.vote);
    }

    get isNew(): boolean {
        return this.vote.status === '';
    }

    get rowState() {
         return { 
                'color': 'rgb(59, 59, 59)',
                'cursor': 'auto'
         }
    }

    get master(): Master {
        return this.$store.getters.master;
    }

    async onStartVote() {
        if (!this.vote) {
            return;
        }
        if (VoteService.isOpen(this.vote)) {
            const newVote = await VoteService.setRunning(this.vote);
            if (newVote) {
                SocketService.emitMasterVoteChanged(this.master, this.vote);
                this.vote = newVote;
                await StoreService.reloadMaster();
            }
        }
    }
}
</script>

<style scoped>
    .bcolor {
        background-color: rgb(230, 230, 230);
    }
    .btn-w {
        width: 60px;
    }
</style>