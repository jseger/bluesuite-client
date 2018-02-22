import Vue from 'vue'
import Vuex from 'vuex'
import Shared from './shared'
import User from './user'
import AppAdmin from './appAdmin'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    shared: Shared,
    user: User,
    appAdmin: AppAdmin
  }
})
