import { http } from '@/utils'
const { log, error } = console


export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        // 查询二维码列表
        QRCODE_LIST({commit}, params = {}) {
            const { page = 1, limit = 10, sidx = 'qr_id', order = 'desc', qrDesc = '' } = params
            return http.get('/wx/wxqrcode/list', {
                params: {
                    page, limit, sidx, order, qrDesc
                }
            })
        },
        // 查询二维码详情
        QRCODE_INFO({commit}, qrid = 0) {
            return http.get('/wx/wxqrcode/info/' + qrid)
        },
        // 添加二维码
        QRCODE_ADD({commit}, data = {}) {
            const { 
                qrId = 0,
                qrUrl = '',
                qrTime = '',
                qrDesc = ''
            } = data
            return http.post('/wx/wxqrcode/save', {
                qrId, qrUrl, qrTime, qrDesc
            })
        },
        // 更新二维码
        QRCODE_UPDATE({commit}, data = {}) {
            const { 
                qrId = 0,
                qrUrl = '',
                qrTime = '',
                qrDesc = ''
            } = data
            return http.post('/wx/wxqrcode/update', {
                qrId, qrUrl, qrTime, qrDesc
            })
        },
        // 删除二维码
        QRCODE_DELETE({commit}, ids = []) {
            return http.post('/wx/wxqrcode/delete', ids)
        },
        // 查询考场会议室列表
        EXAM_LIST({commit}, params = {}) {
            const { 
                page = 1,
                limit = 10,
                sidx = 'miOrdertime',
                order = 'desc',
                beforTime = '',
                afterTime = ''
            } = params
            return http.get('/wx/wxmeetinginfo/list', {
                params: {
                    page, limit, sidx, order, beforTime, afterTime
                }
            })
        },
        // 查询考场会议室详情
        EXAM_INFO({commit}, miId = 0) {
            return http.get('/wx/wxmeetinginfo/info/' + miId)
        },
        // 添加考场会议室
        EXAM_ADD({commit}, data = {}) {
            const { 
                miId = 0,
                miOrdertime = "",
                miWebexNumber = "",
                miWebexUrl = "",
                miPassword = ""
            } = data
            return http.post('/wx/wxmeetinginfo/save', {
                miId, miOrdertime, miWebexNumber, miWebexUrl, miPassword
            })
        },
        // 更新考场会议室
        EXAM_UPDATE({commit}, data = {}) {
            const { 
                miId = 0,
                miOrdertime = "",
                miWebexNumber = "",
                miWebexUrl = "",
                miPassword = ""
            } = data
            return http.post('/wx/wxmeetinginfo/update', {
                miId, miOrdertime, miWebexNumber, miWebexUrl, miPassword
            })
        },
        // 删除考场会议室
        EXAM_DELETE({commit}, ids = []) {
            return http.post('/wx/wxmeetinginfo/delete', ids)
        }
    }
}