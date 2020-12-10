import http from './server/http'
import { Master } from '../models/master'
import { Member } from '../models/member';
import { Vote } from '../models/vote';
import { MemberVote } from '../models/memberVote';
import { MemberVoteValue } from '../models/memberVoteValue';

class MemberService {
    async getMemberVotes (member: Member): Promise<MemberVote[] | undefined> {
        try {
            const api = 'member/' + member.id + '/votes'
            const resp = await http.get(api)
            console.log('MemberService.getMemberVotes', resp);
            return resp.data as MemberVote[];
        } catch (e) {
            console.error(e)
        }
    }

    async saveMemberVote (member: Member, vote: Vote, memberVoteValue: MemberVoteValue): Promise<MemberVote | undefined> {
        try {
        const api = 'member/' + member.id + '/vote/' + vote.id;
        const resp = await http.post(api, memberVoteValue);
        console.log('RESP', resp);
        return resp.data as MemberVote;
        } catch (e) {
        console.error(e)
        }
    }
}

export default new MemberService()