import { Socket } from 'vue-socket.io-extended'
import { Member } from '../models/member';
import { Master } from '../models/master';
import { Vote } from '../models/vote';

class SocketService {
    public $socket: any;

    emitMemberStateChanged(member?: Member) {
        if (member) {
            console.log('emitMemberStateChanged', member);
            this.$socket.client.emit('memberStateChanged', member);
        }
    }

    emitMasterVoteChanged(master: Master, vote: Vote) {
        this.$socket.client.emit('masterVoteChanged', master, vote);
    }

    emitMemberVoteChanged(member: Member, vote: Vote, points: string) {
        this.$socket.client.emit('memberVoteChanged', member, vote, points);
    }

    emitMemberVotingStart(member: Member, vote: Vote) {
        this.$socket.client.emit('memberVotingStart', member, vote);
    }

    emitMemberVotingEnd(member: Member, vote: Vote) {
        this.$socket.client.emit('memberVotingEnd', member, vote);
    }
}

export default new SocketService()