import http from './server/http'
import { Vote } from '../models/vote'
import { DeleteResult } from '../models/deleteResult'
import { MasterResult } from '../models/masterResult';

class VoteService {
  static STATUS_OPEN = 'OPEN';
  static STATUS_CLOSE = '';
  static STATUS_RUNNING = 'RUNNING';
  static STATUS_DONE = 'DONE';

  async getVotes (status?: string): Promise<Vote[] | undefined> {
    try {
      let api = 'vote'
      if (status) {
        api += '?status=' + status
      }
      const resp = await http.get(api)
      return resp.data as Vote[]
    } catch (e) {
      console.error(e)
    }
  }

  async getVote (id: number): Promise<Vote | undefined> {
    try {
      const api = 'vote/' + id;
      const resp = await http.get(api);
      return resp.data as Vote;
    } catch (e) {
      console.error(e)
    }
  }

  async getVotesMasterResult (masterId: number): Promise<MasterResult | undefined> {
    try {
      const api = 'vote/master/' + masterId + '/result';
      const resp = await http.get(api);
      return resp.data as MasterResult;
    } catch (e) {
      console.error(e)
    }
  }

  async createVoteForMaster (masterId: number, name: string): Promise<Vote | undefined> {
    try {
      if (!name) {
        return;
      }
      const api = 'vote/master/' + masterId + '?name=' + name
      const resp = await http.post(api)
      console.log('RESP', resp)
      return resp.data as Vote
    } catch (e) {
      console.error(e)
    }
  }

  async updateVote (vote: Vote): Promise<Vote | undefined> {
    try {
      const api = 'vote'
      const resp = await http.patch(api, vote)
      return resp.data as Vote
    } catch (e) {
      console.error(e)
    }
  }

  isOpen (vote?: Vote): boolean {
    if (!vote) {
      return false;
    }
    return vote.status === VoteService.STATUS_OPEN;
  }

  isRunning (vote?: Vote): boolean {
    if (!vote) {
      return false;
    }
    return vote.status === VoteService.STATUS_RUNNING;
  }

  isClose (vote?: Vote): boolean {
    if (!vote) {
      return false;
    }
    return vote.status === VoteService.STATUS_CLOSE;
  }

  isDone (vote?: Vote): boolean {
    if (!vote) {
      return false;
    }
    return vote.status === VoteService.STATUS_DONE;
  }

  async setOpen(vote: Vote): Promise<Vote | undefined> {
    let v: Vote = vote;
    v.status = VoteService.STATUS_OPEN;
    return await this.updateVote(v);
  }

  async setClose(vote: Vote): Promise<Vote | undefined> {
    let v: Vote = vote;
    v.status = VoteService.STATUS_CLOSE;
    return await this.updateVote(v);
  }

  async setRunning(vote: Vote): Promise<Vote | undefined> {
    let v: Vote = vote;
    v.status = VoteService.STATUS_RUNNING;
    return await this.updateVote(v);
  }

  async setRunningAndDeletePoints(vote: Vote): Promise<Vote | undefined> {
    let v: Vote = vote;
    v.points = '';
    v.status = VoteService.STATUS_RUNNING;
    return await this.updateVote(v);
  }

  async setDone(vote: Vote, points: string): Promise<Vote | undefined> {
    let v: Vote = vote;
    v.status = VoteService.STATUS_DONE;
    v.points = points;
    return await this.updateVote(v);
  }

  async deleteVote (id: number): Promise<DeleteResult | undefined> {
    try {
      const api = 'vote/' + id
      const resp = await http.delete(api)
      return resp.data as DeleteResult
    } catch (e) {
      console.error(e)
    }
  }
}

export default new VoteService()