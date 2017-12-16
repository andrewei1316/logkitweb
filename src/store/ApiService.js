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
    getLogkitVersion: () => {
      return getFactory(API.logkitVersion)()
    },
    getClusterRunners: (opt, param) => {
      return getFactory(API.runnerList)(param)
    },
    getClusterConfig: (opt, param) => {
      let api = API.clusterConfig
      api.url = api.uri + ('/' + param.runnerName)
      return getFactory(api)(param)
    },
    getClusterSlaves: (opt, param) => {
      return getFactory(API.clusterSlaves)(param)
    },
    getSlavesRunnerStatus: (opt, param) => {
      return getFactory(API.slavesRunnerStatus)(param)
    }
  }
}
