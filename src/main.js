// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import iview from 'iview'
import store from './store'
import VueCookie from 'vue-cookie'
import utils from './utils'
// import 'iview/dist/styles/iview.css'
import commonComponents from './components/common'

Vue.use(VueCookie)
Vue.use(iview)
Vue.use(commonComponents)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
