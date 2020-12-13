import { Socket } from 'vue-socket.io-extended'
import { Member } from '../models/member';
import { Master } from '../models/master';
import { Vote } from '../models/vote';

class SocketService {
    public $socket: any;
    
    /** 
     * noch nicht ganz funktionsfähig; Login-State der Member muss noch persistiert werden
     * (sonst verschwindet der Login-Status nach einem Reload der Seite)
     */
    emitMemberLogin(member?: Member) {
        if (member) {
            this.$socket.client.emit('memberLogin', member);
        }
    }

     /** 
      * noch nicht ganz funktionsfähig; Logout-State der Member muss noch persistiert werden
      * (sonst verschwindet der Logout-Status nach einem Reload der Seite)
     */
    emitMemberLogout(member?: Member) {
        if (member) {
            this.$socket.client.emit('memberLogout', member);
        }
    }

    emitMasterVoteChanged(master: Master, vote: Vote) {
        this.$socket.client.emit('masterVoteChanged', master, vote);
    }

    emitMemberVoteChanged(member: Member, vote: Vote) {
        this.$socket.client.emit('memberVoteChanged', member, vote);
    }

    emitMemberVotingStart(member: Member, vote: Vote) {
        this.$socket.client.emit('memberVotingStart', member, vote);
    }

    emitMemberVotingEnd(member: Member, vote: Vote) {
        this.$socket.client.emit('memberVotingEnd', member, vote);
    }
}

export default new SocketService()