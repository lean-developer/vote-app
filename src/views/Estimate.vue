<template>
  <b-container>
    <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
    <div v-if="!loading">
      <div v-if="vote">
           <b-card class="mt-4 mb-4 text-left" bg-variant="dark" text-variant="white">
           <b-card-title class="ml-2">{{vote.name}}
               <b-badge v-if="Points" class="ml-2 mb-2" pill variant="info">{{Points}}</b-badge>
            </b-card-title>
              <b-card-text style="text-align: right;">
              </b-card-text>
              <b-button v-if="isOpen" class="ml-2" variant="success" @click="onStartVote()">Schätzrunde starten</b-button>
              <b-button v-if="isRunning" class="ml-2" variant="secondary" @click="onNeuSchaetzen()">neu schätzen</b-button>
              <b-button v-if="isRunning" class="ml-2" :disabled=!hasPoints variant="success" @click="onBeenden()">Beenden</b-button>
          </b-card>
          <div v-if="isOpen">
                 <b-card v-if="MembersOhneVote" bg-variant="secondary" text-variant="white" class="mb-4" title="offen">
                    <div v-for="m in MembersOhneVote" :key="m.id">
                        <estimate-row-comp :member=m></estimate-row-comp>
                    </div>
                </b-card>
          </div>
          <div v-if="isRunning">
              <div v-if="MemberVoteResult">
                  <b-card bg-variant="success" text-variant="white" class="mb-4" title="geschätzt">
                    <div v-for="mv in MemberVoteResult.memberVotes" :key="mv.member.id">
                        <estimate-row-comp :memberVote=mv @acceptVote=onAcceptVote></estimate-row-comp>
                    </div>
                  </b-card>
                  <b-card v-if="MembersOhneVote" bg-variant="secondary" text-variant="white" class="mb-4" title="offen">
                      <div v-for="m in MembersOhneVote" :key="m.id">
                          <estimate-row-comp :member=m></estimate-row-comp>
                      </div>
                  </b-card>
              </div>
          </div>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service';
import MemberService from '@/domain/api/member.service';
import { Vote } from '@/domain/models/vote';
import EstimateRowComp from '@/components/EstimateRowComp.vue';
import StoreService from '@/domain/api/store.service';
import { Master } from '@/domain/models/master';
import { MemberVoteValue } from '@/domain/models/memberVoteValue';
import { MemberVoteResult } from '@/domain/models/memberVoteResult';
import { Member } from '@/domain/models/member';

@Component({
  components: {
      EstimateRowComp
  },
})
export default class Estimate extends Vue {
    private voteId!: number;
    private vote: Vote | undefined;
    private loading: boolean = false;
    private memberVoteResult!: MemberVoteResult;
    private points: string = '';

    async created() {
        this.voteId = +this.$route.params.voteId;
        this.vote = this.getStoreVote();
        this.loading = true;
        await this.loadMemberVoteResult();
        this.loading = false;
    }

    get Points(): string {
        return this.points;
    }

    get hasPoints(): boolean {
        return this.points.length > 0;
    }

    get MembersOhneVote(): Member[] {
        let membersOhneVote: Member[] = [];
        for (let m of this.master.members) {
            if (this.hasMemberVoted(m)) {
                continue;
            }
            membersOhneVote.push(m);
        }
        return membersOhneVote;
    }

    private hasMemberVoted(member: Member): boolean {
         for (let mv of this.MemberVoteResult.memberVotes) {
            if (mv.member) {
                if (mv.member.id === member.id) {
                    return true;
                }
            }
        }
        return false;
    }

    onAcceptVote(points: string) {
        this.points = points;
    }

    getStoreVote(): Vote | undefined {
        for(let v of this.master.votes) {
            if(v.id === this.voteId) {
                return v;
            }
        }
    }

    async loadMemberVoteResult(): Promise<void> {
        if (this.vote) {
            const result = await MemberService.getMemberVotesResult(this.vote);
            if (result) {
                this.memberVoteResult = result;
            }
        }
    }

    get MemberVoteResult(): MemberVoteResult {
        return this.memberVoteResult;
    }

    get isOpen(): boolean {
        return VoteService.isOpen(this.vote);
    }

    get isRunning(): boolean {
        return VoteService.isRunning(this.vote);
    }

    get master(): Master {
        return this.$store.getters.master;
    }

    get isLogin(): boolean {
        return StoreService.isLogin;
    }

    async onStartVote() {
        if (!this.vote) {
            return;
        }
        if (VoteService.isOpen(this.vote)) {
            const newVote = await VoteService.setRunning(this.vote);
            if (newVote) {
                this.vote = newVote;
                await StoreService.reloadMaster();
            }
        }
    }
}
</script>
