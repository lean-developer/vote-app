import { Master } from '../models/master';
import MasterService from './master.service';
import MemberService from './member.service';
import VoteService from './vote.service';
import { StoreActions } from '@/store';
import { StoreMember } from '../models/storeMember';
import { MemberVote } from '../models/memberVote';
import { Member, MemberState } from '../models/member';
import StoreModel from '@/store/storeModel';
import SocketService from './socket.service';

class StoreService {
    public $store: any;
    private memberMaster!: Master;

    public get master(): Master {
        return this.$store.getters.master;
    }

    public get isMaster(): boolean {
        return (this.master && this.master.uid !== '');
    }

    public get storeMember(): StoreMember {
        return this.$store.getters.member;
    }

    public get isLogin(): boolean {
        return this.master.uid !== '';
    }

    public get MemberMaster(): Master {
        return this.memberMaster;
    }

    /**
     * Master aus DB laden und im Store speichern
     */
    public async reloadMaster() {
        if (!this.isLogin) {
            return;
        }
        const savedMaster: Master | undefined = await MasterService.getMaster(this.master.id);
        if (savedMaster) {
          await this.$store.commit(StoreActions.SaveMaster, savedMaster);
        }
    }

    /**
     * Speichert den StoreMember incl. MemberVotes im Store
     * @param member 
     * @param masterUid 
     * @param memberVotes 
     */
    public async setStoreMember(member: Member, masterUid: string, memberVotes: MemberVote[]) {
        const storeMember: StoreMember = { pin: member.pin, uid: masterUid, name: member.name, memberVotes: memberVotes };
        await this.$store.commit(StoreActions.SaveMember, storeMember);
    }

    public async logoutMember() {
        // MemberState ändern
        const member: Member | undefined = await this.getMember();
        if (member) {
            member.state = MemberState.OFFLINE;
            const offlineMember: Member | undefined = await MemberService.updateMember(member);
            // Member im Store löschen
            const initStoreModel: StoreModel = new StoreModel();
            await this.$store.commit(StoreActions.SaveMember, initStoreModel.member);
            if (offlineMember) {
                this.updateMemberState(offlineMember);
                // Clients benachrichtigen
                SocketService.emitMemberStateChanged(offlineMember);
            }
        }
    }

    public updateMemberState(currentMember: Member) {
        if (this.isMaster) {
            let masterMembers: Member[] = [];
            for (let m of this.master.members) {
              if (m.id === currentMember.id) {
                m.state = currentMember.state;
              }
              masterMembers.push(m);
            }
            this.$store.commit(StoreActions.SaveMasterMembers, masterMembers);
          }
    }

    /**
     * Member aus DB laden; MemberVotes aus DB laden und alles im Store speichern
     */
    public async reloadMember() {
        if (this.storeMember && this.storeMember.pin) {
            const member: Member | undefined = await this.getMember();
            if (member) {
                let memberVotes: MemberVote[] | undefined = await this.loadMemberVotes(member);
                if (!memberVotes) {
                    memberVotes = [];
                }
                await this.setStoreMember(member, this.storeMember.uid, memberVotes);
                await this.reloadMemberVotesIsRunning();
            }
        }
    }

    public async getMember(): Promise<Member | undefined> {
        if (this.storeMember && this.storeMember.uid) {
            const memberMaster: Master | undefined = await MasterService.getMasterByUid(this.storeMember.uid);
            if (memberMaster) {
                this.memberMaster = memberMaster;
                for (let m of memberMaster.members) {
                    if (m.pin === this.storeMember.pin) {
                        return m;
                    }
                }
            }
        }
    }

    public async reloadMemberVotesIsRunning() {
        let cnt: number = 0;
        if (this.MemberMaster) {
          for (let v of this.MemberMaster.votes) {
            if (VoteService.isRunning(v)) {
              cnt++;
            }
          }
        }
        if (cnt > 0) {
            await this.$store.commit(StoreActions.SaveVotesIsRunning, cnt.toString());
        } else {
            await this.$store.commit(StoreActions.SaveVotesIsRunning, '');
        }
    }

    private async loadMemberVotes(member: Member): Promise<MemberVote[] | undefined> {
        const result = await MemberService.getMemberVotes(member);
        if (result) {
            return result;
        }
    }
}

export default new StoreService()