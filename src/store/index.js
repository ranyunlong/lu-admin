import Vue from 'vue'
import Vuex from 'vuex'
import system from './system'
import wechat from './wechat'
import teach from './teach'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        system,
        wechat,
        teach
    }
})

export default store