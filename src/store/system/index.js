import { http } from '@/utils'

let user = localStorage.getItem('user')
const { log, error } = console

if (user) {
    if (/^{[\w\W]+}$/.test(user)) {
        user = JSON.parse(user)
    }
}

export default {
    namespaced: true,
    getters: {
        user(state) {
            return state.user
        },
        menu(state) {
            return state.menu
        },
        originMenu(state) {
            return state.originMenu
        }
    },
    state: {
        user: user || {
            username: '',
            token: '',
            expire: ''
        },
        userInfo: {},
        menu: [],
        originMenu:[]
    },
    mutations: {
        SET_USER(state, data) {
            state.user = data
            localStorage.setItem('user', JSON.stringify(data))
        },
        SET_USER_INFO(state, data) {
            state.userInfo = data
        },
        CLEAR_USER(state) {
            state.user = ''
            localStorage.clear()
        },
        SET_MENU_LIST(state, data) {
            state.menu = data
        },
        SET_ORIGIN_MENU(state, data) {
            state.originMenu = data
        }
    },
    actions: {
        // 获取菜单列表
        GET_MENU_LIST({commit}) {
            const response = http.get('/sys/menu/list')
            response.then((data) => {
                const menus = data.data
                const menu = menus.filter((k) => k.parentId === 0)
                menu.forEach((k) => {
                    menus.forEach((value) => {
                        if (value.parentId === k.menuId) {
                            k.children = k.children || []
                            k.children.push(value)
                        }
                    })
                })
                commit('SET_ORIGIN_MENU', menus)
                commit('SET_MENU_LIST', menu)
            })
            return response
        },
        // 登陆接口
        LOGIN({commit}, data) {
            const { username } = data
            const response = http({
                method: "post",
                url: '/sys/login',
                data
            })
            response.then(({data} )=> {
                const { code, expire, token } = data
                if (code === 0) {
                    commit('SET_USER', {
                        expire,
                        token,
                        username
                    })
                }
            })
            return response
        },
        // 获取用户信息接口
        GET_USER_INFO({commit}, data) {
            const response = http.get('/sys/user/info')
            response.then(({data}) => {
                if (data.code === 0 && data.user) {
                    commit('SET_USER_INFO', data.user)
                }
            })
            return response
        },
        // 退出登陆
        LOG_OUT({commit}) {
            commit('CLEAR_USER')
        },
        // 获取管理员列表
        GET_ADMIN_LIST({commit}, data = {}) {
            const { page = 1, limit = 10, sidx = 'userId', order = "asc", username = "" } = data
            return http.get('/sys/user/list', {
                params: {
                    page,
                    limit,
                    sidx,
                    order,
                    username
                }
            })
        },
        // 更新管理员
        UPDATE_ADMIN({commit}, data = {}) {
            return http.post('/sys/user/update', data)
        }
    }
}