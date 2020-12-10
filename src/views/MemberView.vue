<template>
  <b-container>
      <div v-if="member">
          <b-row class="head">
              <b-col class="ml-4" style="text-align: left;">
                  <h4>{{member.name}}</h4>
              </b-col>
              <b-col style="text-align: right;" class="mb-1">
                  <b-button pill variant="light" @click="onMemberLogout()"><i class="fas fa-sign-out-alt"></i></b-button>
              </b-col>
              <div class="line"></div>
          </b-row>
          <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
          <div v-if="!loaing">
            <div v-if="votes">
                <div v-for="v in votes" :key="v.id">
                    <member-vote-comp @save=onMemberVoteSave class="ml-4 mr-4" :vote=v></member-vote-comp>
                </div>
            </div>
          </div>
      </div>
  </b-container>
</template>

<script lang="ts">
import { Component, Model, Vue } from 'vue-property-decorator';
import VoteService from '@/domain/api/vote.service'
import { Vote } from '@/domain/models/vote';
import StoreService from '@/domain/api/store.service';
import { Master } from '@/domain/models/master';
import StoreModel from '@/store/storeModel';
import { StoreActions } from '@/store';
import { StoreMember } from '@/domain/models/storeMember';
import MasterService from '@/domain/api/master.service';
import MemberVoteComp from '@/components/MemberVoteComp.vue';
import MemberService from '../domain/api/member.service';
import { MemberVoteValue } from '../domain/models/memberVoteValue';
import { Member } from '@/domain/models/member';
import { MemberVote } from '@/domain/models/memberVote';

@Component({
  components: {
      MemberVoteComp
  },
})
export default class MemberView extends Vue {
    @Model() private votes: Vote[] = [];
    private loading: boolean = false;
    private myMember!: Member | undefined;
    private myMaster!: Master;

    async created() {
        if (this.isMaster) {
            this.setMemberVotes(this.master.votes);        
            this.myMember = this.getMemberByMaster(this.master);
            console.log('MYMEMBER', this.myMember);
        }
        else {
            await this.loadMaster();
            this.myMember = this.getMemberByMaster(this.myMaster);
            console.log('MYMEMBER', this.myMember);
        }
    }

    setMemberVotes(allVotes: Vote[]) {
        this.votes = [];
        for (let v of allVotes) {
            if (VoteService.isOpen(v) || VoteService.isRunning(v)) {
                this.votes.push(v);
            }
        }
    }

    getMemberByMaster(theMaster: Master): Member | undefined {
        for (let m of theMaster.members) {
            if (m.pin) {
                if (this.member.pin === m.pin) {
                    return m;
                }
            }
        }
    }

    async loadMaster() {
        this.loading = true;
        const master: Master | undefined = await MasterService.getMasterByUid(this.member.uid);
        if (master) {
            this.setMemberVotes(master.votes);
            this.myMaster = master;
        }
        this.loading = false;
    }

    async loadMemberVotes() {
        // TODO
    }

    async onMemberVoteSave(vote: Vote, points: string) {
        console.log('SAVE VOTE, POINTS', vote, points);
        if (this.myMember && vote) {
            let memberVoteValue: MemberVoteValue = {
                points: points,
                note: ''
            }
            const memberVote: MemberVote | undefined = await MemberService.saveMemberVote(this.myMember.id, vote.id, memberVoteValue);
        }
    }

    async onMemberLogout() {
        const initStoreModel: StoreModel = new StoreModel();
        await this.$store.commit(StoreActions.SaveMember, initStoreModel.member);
        if (this.master) {
            this.$router.push({ name: 'Estimates' })
        }
        else {
            this.$router.push({ name: 'Login' })
        }
    }

    get member(): StoreMember {
        return this.$store.getters.member;
    }

    get master(): Master {
        return this.$store.getters.master;
    }

    get isMaster(): boolean {
        if (this.master && this.master.uid) {
            return true;
        }
        return false;
    }
}
</script>

<style scoped>
    .head {
        margin-top: 2rem;
        margin-right: 2rem;
    }
    .line {
        margin-left: 2rem;
        margin-right: 1rem;
        margin-bottom: 1rem;
        width: 100%;
        border-bottom: 1px solid rgb(181, 181, 181);
        position: relative;
    }
</style>