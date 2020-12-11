import { Vote } from './vote';
import { Member } from './member';

export interface MemberVote {
    vote?: Vote;
    member?: Member;
    points: string;
    note: string;
}