import { User } from '@/domain/models/user'
import { Master } from '@/domain/models/master'
import { StoreMember } from '@/domain/models/storeMember';

export default class StoreModel {
    user: User;
    master: Master;
    member: StoreMember;
    votesIsRunning: string;

    constructor () {
      this.user = {
        name: '',
        email: '',
        photoUrl: '',
        emailVerified: false,
        token: '',
        uid: '',
        creationTime: new Date(),
        lastSignInTime: new Date()
      };
      this.master = {
          id: 0,
          name: '',
          uid: '',
          members: [],
          votes: []
      };
      this.member = {
        pin: 0,
        name: '',
        uid: ''
      };
      this.votesIsRunning = '';
    }
}
