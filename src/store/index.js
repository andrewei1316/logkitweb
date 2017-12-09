import Vue from 'vue'
import Vuex from 'vuex'

import ApiService from './ApiService'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    ApiService
  }
})
