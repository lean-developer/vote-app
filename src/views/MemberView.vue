<template>
  <b-container>
      <div v-if="Member">
          <b-row class="head">
              <b-col class="ml-4" style="text-align: left;">
                  <h4>{{Member.name}}</h4>
              </b-col>
              <b-col style="text-align: right;" class="mb-1">
                  <b-button pill variant="light" @click="onMemberLogout()"><i class="fas fa-sign-out-alt"></i></b-button>
              </b-col>
              <div class="line"></div>
          </b-row>
          <div v-if="loading" class="lds-ripple"><div></div><div></div></div>
          <div v-if="!loading">
            <div v-if="Votes">
                <div v-for="v in Votes" :key="v.id">
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
import { SaveVotePoints } from '@/domain/models/saveVotePoints';
import SocketService from '../domain/api/socket.service';
import { Socket } from 'vue-socket.io-extended';

@Component({
  components: {
      MemberVoteComp
  },
})
export default class MemberView extends Vue {
    private votes: Vote[] = [];
    private loading: boolean = false;
    private myMember!: Member | undefined;
    private myMaster!: Master;
    private memberVotes: MemberVote[] | undefined;

    async created() {
        if (this.IsMaster) {
            this.setVotes(this.Master.votes);        
            this.myMember = this.getMemberByMaster(this.Master);
        }
        else {
            await this.loadMaster();
            this.myMember = this.getMemberByMaster(this.myMaster);
        }
    }

    get Votes(): Vote[] {
        return this.votes;
    }

    setVotes(allVotes: Vote[]) {
        this.votes = [];
        for (let v of allVotes) {
            if (VoteService.isOpen(v) || VoteService.isRunning(v) || VoteService.isDone(v)) {
                this.votes.push(v);
            }
        }
    }

    getMemberByMaster(theMaster: Master): Member | undefined {
        for (let m of theMaster.members) {
            if (m.pin) {
                if (this.Member.pin === m.pin) {
                    return m;
                }
            }
        }
    }

    @Socket('masterVoteChanged')
    async onMasterVoteChanged(result: any) {
        let currentMaster: Master = result[0];
        let currentVote: Vote = result[1];
        console.log('## Socket.masterVoteChanged');
        this.loading = true;
        if (this.IsMaster && this.Master.id === currentMaster.id) {
            this.updateChangedVote(currentVote);
        }
        else if (this.myMaster.id === currentMaster.id) {
            this.updateChangedVote(currentVote);
        }
        this.loading = false;
    }

    updateChangedVote(changedVote: Vote) {
        let newVotes: Vote[] = [];
        for (let v of this.Votes) {
            if(v.id === changedVote.id) {
                newVotes.push(changedVote);
            } else {
                newVotes.push(v);
            }
        }
        this.votes = newVotes;
        console.log('update OK');
    }

    async loadMaster() {
        this.loading = true;
        const master: Master | undefined = await MasterService.getMasterByUid(this.Member.uid);
        if (master) {
            this.setVotes(master.votes);
            this.myMaster = master;
        }
        this.loading = false;
    }
    
    async onMemberVoteSave(saveVotePoints: SaveVotePoints) {
        if (this.myMember && saveVotePoints.vote) {
            let memberVoteValue: MemberVoteValue = {
                points: saveVotePoints.points,
                note: ''
            }
            await MemberService.saveMemberVote(this.myMember, saveVotePoints.vote, memberVoteValue);
            SocketService.emitMemberVoteChanged(this.myMember, saveVotePoints.vote, saveVotePoints.points);
            const updatedMemberVotes: MemberVote[] | undefined = await MemberService.getMemberVotes(this.myMember);
            if (updatedMemberVotes) {
                if (this.IsMaster) {
                    await StoreService.setStoreMember(this.myMember, this.Master.uid, updatedMemberVotes);
                }
                else {
                    await StoreService.setStoreMember(this.myMember, this.myMaster.uid, updatedMemberVotes);
                }
            }
        }
    }

    async onMemberLogout() {
        await StoreService.logoutMember();
        SocketService.emitMemberLogout(this.myMember);
        if (this.IsMaster) {
            this.$router.push({ name: 'Estimates' })
        }
        else {
            this.$router.push({ name: 'Login' })
        }
    }

    get Member(): StoreMember {
        return this.$store.getters.member;
    }

    get Master(): Master {
        return this.$store.getters.master;
    }

    get IsMaster(): boolean {
        if (this.Master && this.Master.uid) {
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