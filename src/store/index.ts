import Vue from 'vue'
import Vuex from 'vuex'
import StoreModel from './storeModel'
import { User } from '@/domain/models/user'
import { Master } from '@/domain/models/master'

Vue.use(Vuex)

export enum StoreActions {
  SaveUser = 'SAVE_USER',
  SaveMaster = 'SAVE_MASTER',
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
    },
    [StoreActions.SaveUser] (state, user: User) {
      state.storeModel.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    [StoreActions.SaveMaster] (state, master: Master) {
      state.storeModel.master = master;
      localStorage.setItem('master', JSON.stringify(master));
    },
  },
  getters: {
    user: (state) => {
      return state.storeModel.user
    },
    master: (state) => {
      return state.storeModel.master
    }
  },
  actions: {
  },
  modules: {
  }
})
