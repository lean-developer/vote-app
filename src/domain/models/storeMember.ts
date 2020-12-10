import { MemberVote } from './memberVote';

export interface StoreMember {
    pin?: number;
    name: string;
    uid: string;
    memberVotes?: MemberVote[];
}