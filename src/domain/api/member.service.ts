import http from './server/http'
import { Master } from '../models/master'
import { Member, MemberState } from '../models/member';
import { Vote } from '../models/vote';
import { MemberVote } from '../models/memberVote';
import { MemberVoteValue } from '../models/memberVoteValue';
import { MemberVoteResult } from '../models/memberVoteResult';

class MemberService {
    async getMemberVotes (member: Member): Promise<MemberVote[] | undefined> {
        try {
            const api = 'member/' + member.id + '/membervote'
            const resp = await http.get(api)
            return resp.data as MemberVote[];
        } catch (e) {
            console.error(e)
        }
    }

    async getMemberVotesResult (vote: Vote): Promise<MemberVoteResult | undefined> {
        try {
            const api = 'member/membervote/' + vote.id;
            const resp = await http.get(api)
            return resp.data as MemberVoteResult;
        } catch (e) {
            console.error(e)
        }
    }

    async updateMember (member: Member): Promise<Member | undefined> {
        try {
            const api = 'member/' + member.id;
            const resp = await http.patch(api, member);
            return resp.data as Member;
        } catch (e) {
            console.error(e)
        }
    }

    async saveMemberVote (member: Member, vote: Vote, memberVoteValue: MemberVoteValue): Promise<MemberVote | undefined> {
        try {
            const api = 'member/' + member.id + '/vote/' + vote.id;
            const resp = await http.post(api, memberVoteValue);
            return resp.data as MemberVote;
        } catch (e) {
            console.error(e)
        }
    }

    async deleteMemberVotesByVote(vote: Vote): Promise<boolean | undefined> {
        try {
            const api = 'member/membervote/' + vote.id;
            const resp = await http.delete(api);
            console.log('DELETED', resp);
            return (resp.status === 200);
        } catch (e) {
            console.error(e)
        }
    }
}

export default new MemberService()