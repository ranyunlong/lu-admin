import Vue from 'vue'
import Vuex from 'vuex'
import system from './system'

Vue.use(Vuex)
export default new Vuex.Store({
    modules: {
        system
    }
})

export const x = {}