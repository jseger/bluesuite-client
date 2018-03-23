import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './auth-guard'
import Welcome from '@/components/Welcome'
import Home from '@/components/Home/Home'
import Login from '@/components/User/Login'
import Register from '@/components/User/Register'
import Profile from '@/components/User/Profile'
import MyApps from '@/components/User/MyApps'
import AppEdit from '@/components/AppBuilder/AppEdit'
import AppForm from '@/Components/Home/AppForm'
import FormPage from '@/components/Form/FormPage'
import MyForms from '@/components/Form/MyForms'
import SubmissionsPage from '@/components/AppBuilder/Submissions/SubmissionsPage'

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
      path: '/myapps',
      name: 'My Apps',
      component: MyApps,
      beforeEnter: AuthGuard
    },
    {
      path: '/app/edit/:id',
      name: 'App Edit',
      props: true,
      component: AppEdit,
      beforeEnter: AuthGuard
    },
    {
      path: '/app/create',
      name: 'App Create',
      component: AppEdit,
      beforeEnter: AuthGuard
    },
    {
      path: '/home/appForm/:id',
      name: 'App Form',
      props: true,
      component: AppForm,
      beforeEnter: AuthGuard
    },
    {
      path: '/myforms',
      name: 'My Forms',
      props: true,
      component: MyForms,
      beforeEnter: AuthGuard
    },
    {
      path: '/form/:appId',
      name: 'Form',
      props: true,
      component: FormPage,
      beforeEnter: AuthGuard
    },
    {
      path: '/form/:appId/:submissionId',
      name: 'Form',
      props: true,
      component: FormPage,
      beforeEnter: AuthGuard
    },
    {
      path: '/submissions/:appId',
      name: 'Submissions',
      props: true,
      component: SubmissionsPage,
      beforeEnter: AuthGuard
    }
  ]
})
