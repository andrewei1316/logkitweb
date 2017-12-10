export default {
  clusterSlaves: {
    url: 'logkit/cluster/slaves',
    params: (param) => {
      return {
        url: param.url,
        tag: param.tag
      }
    }
  },
  slavesRunnerStatus: {
    url: 'logkit/cluster/status',
    params: (param) => {
      return {
        url: param.url,
        tag: param.tag
      }
    }
  },
  logkitVersion: {
    url: 'logkit/version',
    params: () => {
      return {}
    }
  }
}
