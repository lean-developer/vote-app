import { Vote } from './vote';
import { Member } from './member';
import { Product } from './product';

export interface Master {
    id: number;
    name: string;
    uid: string;
    members: Member[];
    votes: Vote[];
    products: Product[];
}