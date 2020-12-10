import { Master } from '../models/master';
import MasterService from './master.service';
import { StoreActions } from '@/store';
import { StoreMember } from '../models/storeMember';
import { MemberVote } from '../models/memberVote';
import { Member } from '../models/member';

class StoreService {
    public $store: any;

    public get master(): Master {
        return this.$store.getters.master;
    }

    public get isLogin(): boolean {
        return this.master.uid !== '';
    }

    async reloadMaster() {
        if (!this.isLogin) {
            return;
        }
        const savedMaster: Master | undefined = await MasterService.getMaster(this.master.id);
        if (savedMaster) {
          await this.$store.commit(StoreActions.SaveMaster, savedMaster);
        }
    }

    async setStoreMember(member: Member, master: Master, memberVotes: MemberVote[]) {
        const storeMember: StoreMember = { pin: member.pin, uid: master.uid, name: member.name, memberVotes: memberVotes };
        await this.$store.commit(StoreActions.SaveMember, storeMember);
    }
}

export default new StoreService()