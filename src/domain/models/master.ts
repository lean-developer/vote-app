import { Vote } from './vote';
import { Member } from './member';

export interface Master {
    id: number;
    name: string;
    uid: string;
    members: Member[];
    votes: Vote[];
}