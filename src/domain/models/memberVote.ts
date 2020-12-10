import { Vote } from './vote';
import { Member } from './member';

export interface MemberVote {
    vote: Vote;
    points: string;
    note: string;
}