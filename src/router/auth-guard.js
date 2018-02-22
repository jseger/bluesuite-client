import { store } from '../store'
import decode from 'jwt-decode'

export default (to, from, next) => {
  if (isAuthenticated()) {
    console.log('router')
    store.dispatch('pageTitle', to.name)
    next()
  } else {
    next('/login')
  }
}

export function getToken () {
  return localStorage.getItem('token')
}

export function setToken (token) {
  localStorage.setItem('token', token)
}

export function isAuthenticated () {
  if (getToken()) {
    const token = decode(getToken())
    if (token) {
      if (token.exp) {
        const date = new Date(0)
        date.setUTCSeconds(token.exp)
        if (date > new Date()) {
          return true
        }
      }
    }
  }
  return false
}
