import { MemberVote } from './memberVote';
import { Vote } from './vote';

export interface MemberVoteResult {
    vote: Vote;
    referencePoints: string;
    memberVotes: MemberVote[];
}