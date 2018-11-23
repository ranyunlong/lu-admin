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
            response.then(({data}) => {
                if (Array.isArray(data)) {
                    const menus = data
                    const menu = menus.filter((k) => k.parentId === 0)
                    function deep(arr) {
                        arr.forEach((k) => {
                            k.children = menus.filter(v => v.parentId === k.menuId)
                            deep(k.children)
                        })
                    }
                    deep(menu)
                    commit('SET_ORIGIN_MENU', menus)
                    commit('SET_MENU_LIST', menu)
                }
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
        GET_ADMIN_INFO({commit}, userId = -1) {
            return http.get('/sys/user/info/'+userId)
        },
        // 更新管理员
        UPDATE_ADMIN({commit}, data = {}) {
            return http.post('/sys/user/update', data)
        },
        // 添加管理员
        ADD_ADMIN({commit}, data = {}) {
            return http.post('/sys/user/save', data)
        },
        // 删除管理员
        DELETE_ADMIN({commit}, data = []) {
            if (!Array.isArray(data)) throw new Error('DELETE_ADMIN data must be Array(...userId)')
            const response = http.post('/sys/user/delete', data)
            return response
        },
        // 获取角色列表
        GET_ROLE_LIST({commit}, data = {}) {
            const { page = 1, limit = 10, sidx = 'roleId', order = 'asc', roleName = '' } = data
            const response = http.get('/sys/role/list', {
                params: {
                    page,
                    limit,
                    sidx,
                    order,
                    roleName
                }
            })
            return response
        },
        // 查询所有角色信息
        GET_ROLE_SELECT({commit}) {
            const response = http.get('/sys/role/select')
            return response
        },
        // 添加角色
        ADD_ROLE({commit}, data = {}) {
            const { roleId = 0, roleName = '', remark = '', menuIdList = [] } = data
            return http.post('/sys/role/save', data)
        },
        // 删除角色
        DELETE_ROLE({commit}, data = []) {
            if (!Array.isArray(data)) throw new Error('Invalid data: post data must be an Array.')
            return http.post('/sys/role/delete', data)
        },
        // 更新角色
        UPDATE_ROLE({commit}, data = {}) {
            const { roleId = 0, roleName = '', remark = '', menuIdList = [] } = data
            return http.post('/sys/role/update', data)
        },
        // 角色详情
        GET_ROLE_INFO({commit}, roleId = 0) {
           return http.get('/sys/role/info/'+roleId)
        },
        // 添加菜单
        ADD_MENU({commit}, data = {}) {
            const {
                icon = '', 
                list = [], 
                menuId = 0, 
                module = 0, 
                name = '', 
                open = true, 
                orderNum = 0,
                parentId = 0,
                parentName = '',
                perms = '',
                type = 0,
                url = ''
            } = data
            return http.post('/sys/menu/save', {
                icon,
                list,
                menuId,
                module,
                name,
                open,
                orderNum,
                parentId,
                parentName,
                perms,
                type,
                url
            })
        },
        // 更新菜单
        UPDATE_MENU({commit}, data = {}) {
            const {
                icon = '', 
                list = [], 
                menuId = 0, 
                module = 0, 
                name = '', 
                open = true, 
                orderNum = 0,
                parentId = 0,
                parentName = '',
                perms = '',
                type = 0,
                url = ''
            } = data
            return http.post('/sys/menu/update', {
                icon,
                list,
                menuId,
                module,
                name,
                open,
                orderNum,
                parentId,
                parentName,
                perms,
                type,
                url
            })
        },
        // 删除菜单
        DELETE_MENU({commit}, menuId = '') {
            return http.post('/sys/menu/delete/' + menuId)
        },
        // 获取日志
        GET_LOG_LIST({commit}, params = {}) {
            const {
                page = 1,
                limit = 10,
                sidx = 'id',
                order = 'desc',
                key = ''
            } = params
           return http.get('/sys/log/list', {params: {
               page,
               limit,
               sidx,
               order,
               key
           }})
        },
        // 获取定时任务
        GET_SCHEDULE_LIST({commit}, params = {}) {
            const {
                page = 1,
                limit = 10,
                sidx = 'jobId',
                order = 'asc',
                beanName = ''
            } = params
            return http.get('/sys/schedule/list', {params: {
                page,
                limit,
                sidx,
                order,
                beanName
            }})
        },
        // 获取任务详情
        GET_SCHEDULE_INFO({commit}, jobId = 0){
            return http.get('/sys/schedule/info/' + jobId)
        },
        // 暂停定时任务
        SCHEDULE_PAUSE({commit}, jobIds = []) {
           return http.post('/sys/schedule/pause', jobIds)
        },
        // 启动定时任务
        SCHEDULE_RUN({commit}, jobIds = []) {
            return http.post('/sys/schedule/run', jobIds)
        },
        // 恢复定时任务 
        SCHEDULE_RESUME({commit}, jobIds = []) {
            return http.post('/sys/schedule/resume', jobIds)
        },
        // 添加定时任务
        ADD_SCHEDULE({commit}, data = {}) {
            const {
                beanName = '',
                cronExpression = '',
                jobId = 0,
                methodName =  '',
                params = '',
                remark = '',
                status = 0
            } = data
            return http.post('/sys/schedule/save', {
                beanName,
                cronExpression,
                jobId,
                methodName,
                params,
                remark,
                status
            })
        },
        // 修改定时任务
        UPDATE_SCHEDULE({commit}, data = {}) {
            const {
                beanName = '',
                cronExpression = '',
                jobId = 0,
                methodName =  '',
                params = '',
                remark = '',
                status = 0
            } = data
            return http.post('/sys/schedule/update', {
                beanName,
                cronExpression,
                jobId,
                methodName,
                params,
                remark,
                status
            })
        },
        // 删除定时任务
        DELETE_SCHEDULE({commit}, jobIds = []) {
            return http.post('/sys/schedule/delete', jobIds)
        },
        // 获取参数管理列表
        GET_CONFIG_LIST({commit}, params = {}) {
            const {
                page = 1,
                limit = 10,
                sidx = 'id',
                order = 'desc',
                key = ''
            } = params
            return http.get('/sys/config/list', {params})
        },
        // 获取参数管理详情
        GET_CONFIG_INFO({commit}, id = '') {
            return http.get('/sys/config/info/' + id)
        },
        // 添加参数管理
        ADD_CONFIG({commit}, data = {}) {
            const { 
                id = 0,
                key = "",
                value = "",
                remark = ""
            } = data
            return  http.post('/sys/config/save', {
                id,
                key,
                value,
                remark
            })
        },
        // 更新参数管理
        UPDATE_CONFIG({commit}) {
            const { 
                id = 0,
                key = "",
                value = "",
                remark = ""
            } = data
            return  http.post('/sys/config/update', {
                id,
                key,
                value,
                remark
            })
        },
        // 删除参数管理
        DELETE_CONFIG({commit}, id = []) {
            return http.post('/sys/config/delete')
        }

    }
}