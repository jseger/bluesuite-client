export default {
  state: {
    pageTitle: '',
    loading: false,
    appLoading: false,
    errors: [],
    info: [],
    warnings: [],
    notifications: []
  },
  mutations: {
    setLoading (state, payload) {
      state.loading = payload
    },
    setAppLoading (state, payload) {
      state.appLoading = payload
    },
    pushError (state, payload) {
      state.notifications.push({group: 'error', text: payload, type: 'error'})
    },
    pushInfo (state, payload) {
      state.notifications.push({group: 'info', text: payload, type: 'info'})
    },
    pushWarning (state, payload) {
      state.notifications.push({group: 'warning', text: payload, type: 'warning'})
    },
    pushNotification (state, payload) {
      state.notifications.push({group: 'success', text: payload, type: 'success'})
    },
    setPageTitle (state, payload) {
      state.pageTitle = payload
    }
  },
  actions: {
    pageTitle ({commit}, payload) {
      commit('setPageTitle', payload)
    },
    setLoading ({commit}, payload) {
      commit('setLoading', payload)
    }
  },
  getters: {
    loading (state) {
      return state.loading
    },
    notifications (state) {
      return state.notifications
    },
    pageTitle (state) {
      return state.pageTitle
    },
    appLoading (state) {
      return state.appLoading
    }
  }
}
