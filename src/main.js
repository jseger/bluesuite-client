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

Vue.use(Vuetify)
Vue.use(Notifications)
Vue.use(VueAxios, axios)
Vue.axios.defaults.baseURL = 'http://localhost:3000'

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
    .then(() => {
      this.$router.push('/home')
    })
    .catch((err) => {
      console.log(err)
    })
  }
})
