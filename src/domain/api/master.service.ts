import http from './server/http'
import { Master } from '../models/master'
import { Member } from '../models/member';
import { DeleteResult } from '../models/deleteResult';

class MasterService {
    async getMaster (id: number): Promise<Master | undefined> {
    try {
        const api = 'master/' + id;
        const resp = await http.get(api)
        return resp.data as Master
    } catch (e) {
        console.error(e)
    }
      }

  async getMasterByUid (uid: string): Promise<Master | undefined> {
    try {
      const api = 'master/uid/' + uid;
      const resp = await http.get(api)
      return resp.data as Master
    } catch (e) {
      console.error(e)
    }
  }

  async createMaster (name: string, uid: string): Promise<Master | undefined> {
    try {
      const api = 'master?name=' + name + '&uid=' + uid;
      const resp = await http.post(api);
      return resp.data as Master
    } catch (e) {
      console.error(e)
    }
  }

  async createMemberOfMaster (masterId: number, memberName: string): Promise<Member | undefined> {
    try {
      if (!memberName) {
        return;
      }
      const api = 'member/master/' + masterId + '?name=' + memberName;
      const resp = await http.post(api);
      const member: Member = {
        id: resp.data.id,
        name: resp.data.name
      }
      return member;
    } catch (e) {
      console.error(e)
    }
  }

  async deleteMemberOfMaster(masterId: number, memberId: number): Promise<DeleteResult | undefined> {
    try {
      const api = 'member/' + memberId + '/master/' + masterId;
      const resp = await http.delete(api);
      return resp.data as DeleteResult;
    } catch (e) {
      console.error(e)
    }
  }
}

export default new MasterService()