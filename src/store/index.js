import Vue from 'vue'
import Vuex from 'vuex'
import system from './system'
import wechat from './wechat'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        system,
        wechat
    }
})

export default store