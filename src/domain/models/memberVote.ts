import { Vote } from './vote';
import { Member } from './member';

export interface MemberVote {
    member: Member;
    vote: Vote;
    points: string;
    note: string;
}