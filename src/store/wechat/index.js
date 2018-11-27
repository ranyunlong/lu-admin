import { http } from '@/utils'
const { log, error } = console


export default {
    namespaced: true,
    state: {},
    getters: {},
    mutations: {},
    actions: {
        // 查询公司信息列表
        WX_COMPANY_LIST({commit}, params = {}) {
            const { page = 1, limit = 10, sidx = 'COM_ID', order = 'desc', companyName = '' } = params
            return http.get('/wx/wxcompany/list', {
                params: {
                    page, limit, sidx, order, companyName 
                }
            })
        },
        // 获取公司信息详情
        WX_COMPANY_INFO({commit}, comId = 0) {
            return http.get('/wx/wxcompany/info/' + comId)
        },
        // 添加微信公司信息
        WX_COMPANY_ADD({commit}, data = {}) {
            const { comId = 0 , comCompany = '', comLogo = '', comLable = '' } = data
            return http.post('/wx/wxcompany/save', {
                comId,
                comCompany,
                comLogo,
                comLable
            })
        },
        // 更新公司信息
        WX_COMPANY_UPDATE({commit}, data = {}) {
            const { comId = 0 , comCompany = '', comLogo = '', comLable = '' } = data
            return http.post('/wx/wxcompany/update', {
                comId,
                comCompany,
                comLogo,
                comLable
            })
        },
        // 删除公司信息
        WX_COMPANY_DELETE({commit}, ids = []) {
            return http.post('/wx/wxcompany/delete', ids)
        },
        // 企业家信息列表
        WX_ENTREPRENEUR_LIST({commit}, params = {}) {
            const { page = 1, limit = 10, sidx = 'E_ID', order = 'desc', eName = '' } = params
            return http.get('/wx/wxentrepreneur/list', {
                params: {
                    page, limit, sidx, order, eName
                }
            })
        },
        // 获取企业家信息详情
        WX_ENTREPRENEUR_INFO({commit}, eId = 0) {
            return http.get('/wx/wxentrepreneur/info/' + eId)
        },
        // 添加企业家信息
        WX_ENTREPRENEUR_ADD({commit}, data = {}) {
            const { 
                eid = 0,
                eentrepreneur = "",
                epost = "" 
            } = data
            return http.post('/wx/wxentrepreneur/save', {
                eid,
                eentrepreneur,
                epost
            })
        },
        // 更新企业家信息
        WX_ENTREPRENEUR_UPDATE({commit}, data = {}) {
            const { 
                eid = 0,
                eentrepreneur = "",
                epost = "" 
            } = data
            return http.post('/wx/wxentrepreneur/update', {
                eid,
                eentrepreneur,
                epost
            })
        },
        // 删除企业家信息
        WX_ENTREPRENEUR_DELETE({commit}, ids = []) {
            return http.post('/wx/wxentrepreneur/delete', ids)
        },
        // 行业信息列表
        WX_INDUSTRY_LIST({commit}, params = {}) {
            const { page = 1, limit = 10, sidx = 'ii_id', order = 'desc', iiIndustryName = '' } = params
            return http.get('/wx/wxideaindustry/list', {
                params: {
                    page, limit, sidx ,order, iiIndustryName
                }
            })
        },
        // 获取行业信息详情
        WX_INDUSTRY_INFO({commit}, iiId = 0) {
            return http.get('/wx/wxideaindustry/info/' + iiId)
        },
        // 添加行业信息
        WX_INDUSTRY_ADD({commit}, data = {}) {
            const { iiId = 0, iiIndustryName = '' } = data
            return http.post('/wx/wxideaindustry/save', {
                iiId,
                iiIndustryName
            })
        },
        // 更新行业信息
        WX_INDUSTRY_UPDATE({commit}, data = {}) {
            const { iiId = 0, iiIndustryName = '' } = data
            return http.post('/wx/wxideaindustry/update', {
                iiId,
                iiIndustryName
            })
        },
        // 删除行业信息
        WX_INDUSTRY_DELETE({commit}, ids = []) {
            return http.post('/wx/wxideaindustry/delete', ids)
        },
        // 职业信息列表
        WX_CAREER_LIST({commit}, params = {}) {
            const { page = 1, limit = 10, sidx = 'IC_ID', order = 'desc', icCareerName = '' } = params
            return http.get('/wx/wxideacareer/list', {
                params: {
                    page, limit, sidx ,order, icCareerName
                }
            })
        },
        // 获取职业信息详情
        WX_CAREER_INFO({commit}, icId = 0) {
            return http.get('/wx/wxideacareer/info/' + icId)
        },
        // 添加职业信息
        WX_CAREER_ADD({commit}, data = {}) {
            const { icId = 0, icCareerName = '' } = data
            return http.post('/wx/wxideacareer/save', {
                icId,
                icCareerName
            })
        },
        // 更新职业信息
        WX_CAREER_UPDATE({commit}, data = {}) {
            const { icId = 0, icCareerName = '' } = data
            return http.post('/wx/wxideacareer/update', {
                icId,
                icCareerName
            })
        },
        // 删除职业信息
        WX_CAREER_DELETE({commit}, ids = []) {
            return http.post('/wx/wxideacareer/delete', ids)
        },
    }
}