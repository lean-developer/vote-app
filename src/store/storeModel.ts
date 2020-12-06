import { User } from '@/domain/models/user'
import { Master } from '@/domain/models/master'

export default class StoreModel {
    user: User;
    master: Master;

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
      }
    }
}
