import http from './server/http'
import { Master } from '../models/master'

class MasterService {
  async getMasterByUid (uid: string): Promise<Master | undefined> {
    try {
      const api = 'master/uid' + uid;
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

}

export default new MasterService()