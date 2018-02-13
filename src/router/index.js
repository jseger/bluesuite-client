import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home/Home'
import Login from '@/components/User/Login'
import Register from '@/components/User/Register'
import Profile from '@/components/User/Profile'
import AppList from '@/components/AppBuilder/List'
import AppEdit from '@/components/AppBuilder/Edit'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      beforeEnter: AuthGuard
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/profile',
      name: 'Edit Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: '/appBuilder',
      name: 'Apps',
      component: AppList,
      beforeEnter: AuthGuard
    },
    {
      path: '/appBuilder/edit/:id',
      name: 'App Edit',
      props: true,
      component: AppEdit,
      beforeEnter: AuthGuard
    },
    {
      path: '/appBuilder/create',
      name: 'App Create',
      component: AppEdit,
      beforeEnter: AuthGuard
    }
  ]
})
