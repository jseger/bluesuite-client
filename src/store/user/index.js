import axios from 'axios'
import decode from 'jwt-decode'

export default {
  state: {
    user: null,
    isAuthenticated: false
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    setIsAuthenticated (state, payload) {
      state.isAuthenticated = payload
    }
  },
  actions: {
    updateUser ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        axios.patch('/user/update', [
          {
            propName: 'email',
            value: payload.email
          },
          {
            propName: 'name',
            value: payload.name
          }
        ])
        .then((result) => {
          localStorage.setItem('token', result.data.token)
          commit('setIsAuthenticated', true)
          const token = decode(result.data.token)
          commit('setUser', {email: token.email, name: token.name, userId: token.userId})
          commit('pushNotification', 'Profile updated!')
          resolve(true)
        })
        .catch(err => {
          commit('pushError', err.response.data.message)
          reject(err)
        })
      })
    },
    changePassword ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        axios.post('/user/changePassword', {
          password: payload.password,
          newPassword: payload.newPassword
        })
        .then((result) => {
          commit('pushNotification', 'Password changed!')
          resolve(true)
        })
        .catch(err => {
          commit('pushError', err.response.data.message)
          reject(err)
        })
      })
    },
    login ({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('setAppLoading', true)
        axios.post('/user/login', {
          email: payload.email,
          password: payload.password
        })
        .then(result => {
          localStorage.setItem('token', result.data.token)
          commit('setIsAuthenticated', true)
          const token = decode(result.data.token)
          commit('setUser', {email: token.email, name: token.name, userId: token.userId})
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
          resolve(true)
        })
        .catch(err => {
          commit('pushError', err.response.data.message)
          reject(err)
        })
        .finally(() => {
          setTimeout(() => {
            commit('setAppLoading', false)
          }, 2000)
        })
      })
    },
    registerUser ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        commit('setAppLoading', true)
        axios.post('/user/signup', {
          email: payload.email,
          password: payload.password,
          name: payload.name
        })
        .then((result) => {
          localStorage.setItem('token', result.data.token)
          commit('setIsAuthenticated', true)
          const token = decode(result.data.token)
          commit('setUser', {email: token.email, name: token.name, userId: token.userId})
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
          resolve(true)
        })
        .catch(err => {
          commit('pushError', err.response.data.message)
        })
        .finally(() => {
          commit('setAppLoading', false)
        })
      })
    },
    logout ({commit}) {
      return new Promise((resolve, reject) => {
        localStorage.setItem('token', null)
        commit('setIsAuthenticated', false)
        resolve(true)
      })
    },
    autoLogin ({commit, getters}) {
      return new Promise((resolve, reject) => {
        if (localStorage.getItem('token')) {
          let token = decode(localStorage.getItem('token'))
          if (token) {
            if (token.exp) {
              const date = new Date(0)
              date.setUTCSeconds(token.exp)
              if (date > new Date()) {
                commit('setIsAuthenticated', true)
                commit('setUser', {email: token.email, name: token.name, userId: token.userId})
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
                resolve(true)
                return
              }
            }
          }
        }
        commit('setIsAuthenticated', false)
        resolve(false)
      })
    },
    refreshToken ({commit, getters}) {
      return new Promise((resolve, reject) => {
        axios.post('/user/refreshToken', {
          token: localStorage.getItem('token')
        })
        .then(result => {
          localStorage.setItem('token', result.data.token)
          commit('setIsAuthenticated', true)
          const token = decode(result.data.token)
          commit('setUser', {email: token.email, name: token.name, userId: token.userId})
          axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
          resolve(true)
        })
        .catch(err => {
          commit('setIsAuthenticated', false)
          commit('pushError', err.response.data.message)
          reject(err)
        })
      })
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    isAuthenticated (state) {
      return state.isAuthenticated
    }
  }
}
