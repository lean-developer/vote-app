import { Master } from './master';
import { MemberVoteResult } from './memberVoteResult';

export interface MasterResult {
    master: Master;
    memberVoteResults: MemberVoteResult[];
}