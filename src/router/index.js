import Vue from 'vue'
import Router from 'vue-router'
import $import from './import'
import store from '@/store'
import { http } from '@/utils'
import { format } from 'upath';

Vue.use(Router)

// 管理页面模块
export const adminModules = [{
  id: 1,
  name: '管理员列表模块',
  component: $import('Admin/User')
}, {
  id: 2,
  name: '角色管理模块',
  component: $import('Admin/Role')
}, {
  id: 3,
  name: '菜单管理模块',
  component: $import('Admin/Menu')
},{
  id: 4,
  name: '系统日志模块',
  component: $import('Admin/Log')
},{
  id: 5,
  name: '定时任务模块',
  component: $import('Admin/JobSchedule')
}, {
  id: 6,
  name: '参数管理模块',
  component: $import('Admin/Config')
}, {
  id: 7,
  name: '上传管理模块',
  component: $import('Admin/Oss')
}]

// 路由是否准备好
let isReady = false

// 主路由
const mainRoutes = [
  {
    path: '/',
    name: 'Home',
    component: $import('Home/index'),
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      auth_repeat_login: true
    },
    component: $import('Login')
  }
]

// 管理页面路由
 const adminRoutes = {
  path: '/admin',
  component: $import('Admin/index'),
  meta: {
    auth_login: true
  },
  children: [{
    path: '/',
    name: 'Admin',
    meta: {
      auth_login: true
    },
    component: $import('Admin/Welcome'),
  }]
}

const router = new Router({
  routes: [
    ...mainRoutes,
    {
      path: '/404.html',
      name: '404',
      component: $import('NotFound'),
    }
  ]
})

function getMenuList(callback) {
  store.dispatch('system/GET_MENU_LIST').then(({data}) => {
    if (Array.isArray(data)) {
      data.forEach(k => {
        if (k.url) {
          const iModule = adminModules.find(value => value.id === k.module)
          const checkRepeat = adminRoutes.children.filter(value => value.path === k.url)
          if (checkRepeat.length === 0) {
            adminRoutes.children.push({
              path: k.url,
              meta: {
                auth_login: true
              },
              component: iModule ? iModule.component : $import('NotFound')
            })
          }
        }
      })
      router.addRoutes([adminRoutes, {
        path: '*',
        redirect: { name: '404' }
      }])
      if (typeof callback === 'function') callback()
    }
  })
}


router.beforeEach((to, from, next) => {
  const { username, token } = store.getters['system/user']
  // 判断路由是否进入到管理页面
  if (/^\/admin/.test(to.fullPath)) {
    // 检测路由是否准备完毕
    if (!isReady) {
      // 判断是否已登录，如果已登录获取管理菜单，否则去登录
      if (username && token) {
        return getMenuList(function() {
          isReady = true
          next({...to, replace: true})
        })
      }
      return next('/login')
    }
  }
  if (to.meta.auth_login) {
    if (username && token) {
      return next()
    } 
    return next('/login')
  } else if (to.meta.auth_repeat_login) {
    if (username && token) {
      return router.push('/admin')
    } 
    next()
  } else {
    return next()
  }
})




export default router