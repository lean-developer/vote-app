import Vue from 'vue'
import Vuex from 'vuex'
import StoreModel from './storeModel'
import { User } from '@/domain/models/user'
import { Master } from '@/domain/models/master'
import { StoreMember } from '@/domain/models/storeMember'
import { Member } from '@/domain/models/member'

Vue.use(Vuex)

/** Store bzgl. UI-Steuerung */
export const uiStore = Vue.observable({
  isNavOpen: false,
  siteCaption: '',
});
// We call toggleNav anywhere we need it in our app
export const mutations = {
  toggleNav() {
      uiStore.isNavOpen = !uiStore.isNavOpen;
  },
  setSiteCaption(caption: string) {
      uiStore.siteCaption = caption;
  }
};

export enum StoreActions {
  SaveUser = 'SAVE_USER',
  SaveMaster = 'SAVE_MASTER',
  SaveMasterMembers = 'SAVE_MASTER_MEMBERS',
  SaveMember = 'SAVE_MEMBER',
  SaveVotesIsRunning = 'SAVE_VOTES_ISRUNNING',
}

/** Persistenter Store (local storage) bzgl. Caching der DB-Operationen 
 * Mutations should be synchronous transactions. 
 * If you need to handle asynchronous operations use Actions.
*/
export default new Vuex.Store({
  state: {
    storeModel: new StoreModel()
  },
  mutations: {
    initialiseStore (state) {
      const userState = localStorage.getItem('user')
      if (userState) {
        state.storeModel.user = JSON.parse(userState)
      }
      const masterState = localStorage.getItem('master')
      if (masterState) {
        state.storeModel.master = JSON.parse(masterState)
      }
      const memberState = localStorage.getItem('member')
      if (memberState) {
        state.storeModel.member = JSON.parse(memberState);
      }
    },
    [StoreActions.SaveUser] (state, user: User) {
      state.storeModel.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    [StoreActions.SaveMaster] (state, master: Master) {
      state.storeModel.master = master;
      localStorage.setItem('master', JSON.stringify(master));
    },
    [StoreActions.SaveMasterMembers] (state, members: Member[]) {
      state.storeModel.master.members = members;
      localStorage.setItem('master', JSON.stringify(state.storeModel.master));
    },
    [StoreActions.SaveMember] (state, member: StoreMember) {
      state.storeModel.member = member;
      localStorage.setItem('member', JSON.stringify(member));
    },
    /** nicht im localStorage! */
    [StoreActions.SaveVotesIsRunning] (state, votesCnt: string) {
      state.storeModel.votesIsRunning = votesCnt;
    }
  },
  getters: {
    user: (state) => {
      return state.storeModel.user
    },
    master: (state) => {
      return state.storeModel.master
    },
    member: (state) => {
      return state.storeModel.member
    },
    memberVotes: (state) => {
      return state.storeModel.member.memberVotes;
    },
    votesIsRunning: (state) => {
      return state.storeModel.votesIsRunning;
    }
  },
  actions: {
  },
  modules: {
  }
})
