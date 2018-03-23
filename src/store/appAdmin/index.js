import axios from 'axios'

export default {
  state: {
    apps: [],
    app: {}
  },
  mutations: {
    setApps (state, payload) {
      state.apps = payload
    },
    setApp (state, payload) {
      state.app = payload
    },
    removeApp (state, payload) {
      state.apps.forEach(app => {
        if (app._id === payload) {
          state.apps.splice(state.apps.indexOf(app), 1)
        }
      })
    }
  },
  actions: {
    fetchApps ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/user/me')
        .then((result) => {
          console.log(result)
          commit('setApps', result.data.user.collaborating)
          resolve(true)
        })
        .catch(err => {
          commit('pushError', err.response.data.message)
          reject(err)
        })
        .finally(() => {
          commit('setLoading', false)
        })
      })
    },
    fetchApp ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.get('/apps/' + payload.id)
        .then((result) => {
          console.log(result)
          commit('setApp', result.data.app)
          resolve(true)
        })
        .catch(err => {
          commit('pushError', err.response.data.message)
          reject(err)
        })
        .finally(() => {
          commit('setLoading', false)
        })
      })
    },
    saveApp ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        console.log(payload)
        if (payload._id) {
          axios.patch('/apps/' + payload._id, [{
            propName: 'name',
            value: payload.name
          },
          {
            propName: 'form',
            value: payload.form
          },
          {
            propName: 'workflow',
            value: payload.workflow
          }])
          .then((result) => {
            commit('setApp', result.data.app)
            commit('pushNotification', 'App saved!')
            resolve(true)
          })
          .catch((err) => {
            reject(err)
            commit('pushError', err.response.data.message)
          })
          .finally(() => {
            commit('setLoading', false)
          })
        } else {
          console.log(payload)
          axios.post('/apps/', payload)
          .then((result) => {
            commit('setApp', result.data.app)
            commit('pushNotification', 'App saved!')
            resolve(true)
          })
          .catch((err) => {
            reject(err)
            commit('pushError', err.response.data.message)
          })
          .finally(() => {
            commit('setLoading', false)
          })
        }
      })
    },
    removeApp ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.delete('/apps/' + payload.id)
        .then((result) => {
          commit('removeApp', payload.id)
          resolve(true)
        })
        .catch((err) => {
          commit('pushError', err.response.data.message)
          reject(err)
        })
        .finally(() => {
          commit('setLoading', false)
        })
      })
    }
  },
  getters: {
    apps (state) {
      return state.apps
    },
    app (state) {
      return state.app
    }
  }
}
