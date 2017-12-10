// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import iView from 'iview'
import router from './router'
import store from './store'
import 'iview/dist/styles/iview.css'
import VueResource from 'vue-resource'
import request from './common/request'

Vue.use(iView)
Vue.use(request)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  store,
  router,
  el: '#app',
  render: h => h(App)
})
