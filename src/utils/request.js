import axios from 'axios'
import router from '../router'
import Qs from 'qs'
import store from '../store'

export const http = axios.create({
    timeout: 1000 * 30,
    // withCredentials: true,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {

    // 请求头带上token
    config.headers['token'] = store.getters['system/user'].token
    config.url = '/api' + config.url
    if (config.method === 'post') {
        config.data = config.data || {}
        config.data.t = new Date().getTime()
        if (/json/.test(config.headers['Content-Type'])) {
            config.data = JSON.stringify(config.data)
        } else if (/x-www-form-urlencoded/.test(config.headers['Content-Type'])) {
            config.data = Qs.stringify(config.data)
        }
    }

    if (config.method === 'get') {
        config.params = config.params || {}
        config.params.t = new Date().getTime()
    }

    return config
}, error => {
    return error
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
    if (response.data && response.data.code === 401) { // 401, token失效
      //clearLoginInfo()
      router.push({ path: '/login' })
    }
    return response
    }, error => {
    return Promise.reject(error)
  })