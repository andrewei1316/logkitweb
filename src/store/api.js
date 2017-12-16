export default {
  logkitVersion: {
    url: 'logkit/version',
    params: () => {
      return {}
    }
  },
  runnerList: {
    url: 'logkit/cluster/runners',
    params: (param) => {
      return {
        url: param.url,
        tag: param.tag
      }
    }
  },
  clusterConfig: {
    uri: 'logkit/cluster/configs',
    params: (param) => {
      return {
        url: param.url,
        tag: param.tag
      }
    }
  },
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
  }
}
