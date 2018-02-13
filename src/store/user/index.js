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
      commit('setLoading', true)
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
        commit('setUser', {email: token.email, name: token.name})
      })
      .catch(err => {
        commit('pushError', err.message)
      })
      .finally(() => {
        commit('setLoading', false)
      })
    },
    login ({commit}, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('http://localhost:3000/user/login', {
          email: payload.email,
          password: payload.password
        })
        .then(result => {
          console.log(result)
          localStorage.setItem('token', result.data.token)
          commit('setIsAuthenticated', true)
          const token = decode(result.data.token)
          commit('setUser', {email: token.email, name: token.name})
          resolve(true)
        })
        .catch(err => {
          commit('pushError', err.message)
          reject(err)
        })
        .finally(() => {
          commit('setLoading', false)
        })
      })
    },
    registerUser ({commit, dispatch}, payload) {
      return new Promise((resolve, reject) => {
        commit('setLoading', true)
        axios.post('http://localhost:3000/user/signup', {
          email: payload.email,
          password: payload.password,
          name: payload.name
        })
        .then(dispatch('login', payload))
        .catch(err => {
          commit('pushError', err.message)
        })
        .finally(() => {
          commit('setLoading', false)
        })
      })
    },
    logout ({commit}) {
      localStorage.setItem('token', null)
      commit('setIsAuthenticated', false)
    },
    autoLogin ({commit, getters}) {
      return new Promise((resolve, reject) => {
        let token = decode(localStorage.getItem('token'))
        if (token) {
          if (token.exp) {
            const date = new Date(0)
            date.setUTCSeconds(token.exp)
            if (date > new Date()) {
              commit('setIsAuthenticated', true)
              commit('setUser', {email: token.email, name: token.name})
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')
              resolve(true)
              return
            }
          }
        }
        commit('setIsAuthenticated', false)
        resolve(false)
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
