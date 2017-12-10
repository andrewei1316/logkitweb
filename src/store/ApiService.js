import Vue from 'vue'
import API from './api'

function getFactory (api) {
  return (param) => Vue.http.get(
    api.url,
    {
      params: api.params(param)
    }
  )
}

export default {
  actions: {
    getClusterSlaves: (opt, param) => {
      return getFactory(API.clusterSlaves)(param)
    },
    getSlavesRunnerStatus: (opt, param) => {
      return getFactory(API.slavesRunnerStatus)(param)
    },
    getLogkitVersion: (opt) => {
      return getFactory(API.logkitVersion)()
    }
  }
}
