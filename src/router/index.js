import Vue from 'vue'
import Router from 'vue-router'
import $import from './import'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: $import('Home/index'),
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: $import('Login')
    },
    {
      path: '/admin',
      component: $import('Admin/index'),
      meta: {
        auth_login: true
      },
      children: [
        {
          path: '/',
          name: 'Admin',
          component: $import('Admin/Welcome'),
        },
        {
          path: 'user',
          name: 'User',
          component: $import('Admin/User')
        },
        {
          path: 'role',
          name: 'Role',
          component: $import('Admin/Role')
        },
        {
          path: 'menu',
          name: 'Menu',
          component: $import('Admin/Menu')
        }
      ]
    }
  ]
})


export default router