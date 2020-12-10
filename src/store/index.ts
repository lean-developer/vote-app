import Vue from 'vue'
import Vuex from 'vuex'
import StoreModel from './storeModel'
import { User } from '@/domain/models/user'
import { Master } from '@/domain/models/master'
import { StoreMember } from '@/domain/models/storeMember'

Vue.use(Vuex)

export enum StoreActions {
  SaveUser = 'SAVE_USER',
  SaveMaster = 'SAVE_MASTER',
  SaveMember = 'SAVE_MEMBER',
}

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
    [StoreActions.SaveMember] (state, member: StoreMember) {
      state.storeModel.member = member;
      localStorage.setItem('member', JSON.stringify(member));
    },
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
    }
  },
  actions: {
  },
  modules: {
  }
})
