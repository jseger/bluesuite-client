// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import Notifications from 'vue-notification'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from '@websanova/vue-auth'
import { store } from './store'
import IdleVue from 'idle-vue'
import decode from 'jwt-decode'

const eventsHub = new Vue()

Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 1000 * 60 * 60 * 24
})

Vue.use(Vuetify)
Vue.use(Notifications)
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://bluesuiteapi.azurewebsites.net/'

console.log(Vue.axios.defaults.baseURL)

Vue.router = router

Vue.use(VueAuth, {
  auth: require('@websanova/vue-auth/drivers/auth/bearer.js'),
  http: require('@websanova/vue-auth/drivers/http/axios.1.x.js'),
  router: require('@websanova/vue-auth/drivers/router/vue-router.2.x.js'),
  tokenStore: 'localStorage',
  authRedirect: {path: '/login'},
  registerData: {url: 'user/signup', method: 'POST', redirect: '/login'},
  loginData: {url: 'user/login', method: 'POST', redirect: '/home', fetchUser: false},
  logoutData: {url: 'user/logout', method: 'POST', redirect: '/', makeRequest: false}
})

Vue.filter('date', function (value) {
  if (!value) return ''
  var d = new Date(value)
  return (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    // this is where we will see if we're authenticated
    this.$store.dispatch('autoLogin')
    .then((result) => {
      if (result) {
        this.$router.push('/home')
      } else {
        this.$router.push('/login')
      }
    })
    .catch(() => {
      this.$router.push('/login')
    })
  },
  onIdle () {
    console.log('idle logging out')
    // token is missing or expired so we should log out
    this.$store.dispatch('logout')
    .then(() => {
      this.$router.push('/login')
    })
  },
  onActive () {
    if (localStorage.getItem('token')) {
      const token = decode(localStorage.getItem('token'))
      if (token) {
        if (token.exp) {
          const date = new Date(0)
          date.setUTCSeconds(token.exp)
          if (date > new Date()) {
            console.log('active')
            // token is not expired so we can refresh
            this.$store.dispatch('refreshToken')
            .then(() => {
              console.log('token refreshed')
            })
            .catch(() => {
              this.$router.push('/login')
            })
          }
        }
      }
    }
  }
})
