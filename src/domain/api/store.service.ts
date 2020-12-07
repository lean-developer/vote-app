import { Master } from '../models/master';
import MasterService from './master.service';
import { StoreActions } from '@/store';

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
}

export default new StoreService()