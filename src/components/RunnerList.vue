<template>
  <div>
    <div> <h3>收集器管理列表</h3><br/> </div>
    <Table :loading="loading" :data="tableData" :columns="tableColumns" stripe></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="10" :current="1" @on-change="changePage"></Page>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['tag', 'url'],
    name: 'RunnerList',
    data: function () {
      return {
        loading: false,
        allRunners: [],
        tableData: [],
        tableColumns: [],
        tableColumnsData: [
          {
            title: '名称',
            key: 'name'
          },
          {
            title: '集群',
            key: 'tag'
          },
          {
            title: '机器',
            key: 'url'
          },
          {
            title: '运行时长',
            key: 'elaspedTime'
          },
          {
            title: '运行状态',
            key: 'runningStatus',
            align: 'center',
            width: 140,
            render: (h, param) => {
              let color = param.row.runningStatus === 'running' ? 'green' : 'yellow'
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: color
                },
                style: {
                  border: '0px !important',
                  background: 'transparent !important'
                }
              }, param.row.runningStatus)
            }
          },
          {
            title: '读取(条)',
            key: 'readDataCount'
          },
          {
            title: '读取(条/秒)',
            key: 'readSpeed'
          },
          {
            title: '读取(字节/秒)',
            key: 'readSpeedKb'
          },
          {
            title: '解析(成功/总)',
            key: 'parserCount'
          },
          {
            title: '发送(成功/总)',
            key: 'senderCount'
          },
          {
            title: '发送(条/秒)',
            key: 'senderSpeed'
          },
          {
            title: '查看',
            key: 'show',
            align: 'center',
            width: 80,
            render: (h, param) => {
              let color = 'black'
              let type = 'checkmark-circled'
              let errors = param.row.runnerError
              if (errors.parser + errors.reader + errors.sender !== '') {
                color = 'red'
                type = 'information-circled'
              }
              return h('Dropdown', {
                props: {
                  transfer: true,
                  trigger: 'hover',
                  placement: 'bottom'
                },
                on: {
                  'on-click': (name) => {
                    this.showDetail(name, param)
                  }
                }
              }, [
                h('a', {
                  attr: {
                    href: 'javascript:void(0)'
                  }
                }, [
                  h('Icon', {
                    props: {
                      size: 20,
                      color: color,
                      type: 'navicon'
                    }
                  })
                ]),
                h('DropdownMenu', {
                  slot: 'list'
                }, [
                  h('DropdownItem', {
                    props: {
                      name: 'config'
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'document-text'
                      }
                    }),
                    h('span', ' 配置文件')
                  ]),
                  h('DropdownItem', {
                    props: {
                      divided: true,
                      name: 'errors'
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: type,
                        color: color
                      }
                    }),
                    h('span', ' 错误日志')
                  ])
                ])
              ])
            }
          },
          {
            title: '操作',
            key: 'opt',
            align: 'center',
            width: 80,
            render: (h, param) => {
              return h('Dropdown', {
                props: {
                  trigger: 'hover',
                  placement: 'bottom',
                  transfer: true
                },
                on: {
                  'on-click': (name) => {
                    this.runnerManger(name, param)
                  }
                }
              }, [
                h('a', {
                  attr: {
                    href: 'javascript:void(0)'
                  }
                }, [
                  h('Icon', {
                    props: {
                      size: 20,
                      color: 'black',
                      type: 'navicon'
                    }
                  })
                ]),
                h('DropdownMenu', {
                  slot: 'list'
                }, [
                  h('DropdownItem', {
                    props: {
                      name: 'update'
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'edit'
                      }
                    }),
                    h('span', ' 更新收集器')
                  ]),
                  h('DropdownItem', {
                    props: {
                      divided: true,
                      name: 'startStop'
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: param.row.runningStatus === 'running' ? 'stop' : 'play'
                      }
                    }),
                    h('span', param.row.runningStatus === 'running' ? ' 关闭收集器' : ' 开启收集器')
                  ]),
                  h('DropdownItem', {
                    props: {
                      divided: true,
                      name: 'reset'
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'refresh'
                      }
                    }),
                    h('span', ' 重置收集器')
                  ]),
                  h('DropdownItem', {
                    props: {
                      divided: true,
                      name: 'delete'
                    }
                  }, [
                    h('Icon', {
                      props: {
                        type: 'trash-a'
                      }
                    }),
                    h('span', ' 删除收集器')
                  ])
                ])
              ])
            }
          }
        ]
      }
    },
    created: function () {
      this.fetchData()
    },
    watch: {
      '$route': 'fetchData'
    },
    computed: {
      clusterUrl: function () {
        return '/cluster/' + this.tag
      }
    },
    methods: {
      fetchData () {
        this.initTableColumns()
        let allRunners = []
        let that = this
        that.loading = true
        let actUrl = that.addHttpPrefix()
        that.request('getSlavesRunnerStatus', { url: actUrl, tag: that.tag }, function (data) {
          for (let url in data) {
            let tag = data[url].tag
            let runnerStatus = data[url].status
            for (let name in runnerStatus) {
              let status = runnerStatus[name]
              let sn = Object.keys(status['senderStats'])[0]
              let sender = sn === undefined ? undefined : status['senderStats'][sn]
              allRunners.push({
                name: status['name'],
                tag: tag,
                url: url,
                elaspedTime: that.formatSecond(status['elaspedtime']),
                statusIcon: status['runningStatus'] === 'running' ? 'stop' : 'play',
                createTime: status['createTime'],
                runningStatus: status['runningStatus'],
                readDataCount: status['readDataCount'],
                readSpeed: status['readspeed'],
                readSpeedKb: status['readspeed_kb'],
                readSpeedTrend: status['readspeedtrend'],
                readSpeedTrendKb: status['readspeedtrend_kb'],
                parserTrend: status['parserStats']['trend'],
                parserCount: status['parserStats']['success'] + '/' + (status['parserStats']['success'] + status['parserStats']['errors']),
                senderTrend: sender === undefined ? 'stable' : sender['trend'],
                senderCount: sender === undefined ? '0/0' : (sender['success'] + '/' + (sender['success'] + sender['errors'])),
                senderSpeed: sender === undefined ? '0' : sender['speed'],
                runnerError: {
                  reader: status['readerStats']['last_error'],
                  parser: status['parserStats']['last_error'],
                  sender: sender === undefined ? '' : sender['last_error']
                }
              })
            }
          }
          that.loading = false
          that.allRunners = allRunners
          that.total = that.allRunners.length / 10 + that.allRunners.length % 10
          that.mockTableData(1)
        }, function () {
          that.loading = false
        }, '', '拉取收集器状态失败')
      },
      addHttpPrefix () {
        if (this.url) return 'http://' + this.url
        return ''
      },
      mockTableData (page) {
        let tableData = []
        if (page < 0) page = 0
        for (let i = (page - 1) * 10; i < page * 10 && i < this.allRunners.length; i++) {
          tableData.push(this.allRunners[i])
        }
        this.tableData = tableData
      },
      changePage (curPage) {
        this.mockTableData(curPage)
      },
      initTableColumns () {
        let tableColumns = []
        this.tableColumnsData.forEach((ele) => {
          if (this.tag && ele.key === 'tag') {
            return true
          }
          if (this.url && ele.key === 'url') {
            return true
          }
          tableColumns.push(ele)
        })
        this.tableColumns = tableColumns
      },
      formatSecond (second) {
        let day = Math.floor(second / 3600 / 24)
        let hour = Math.floor((second - day * 24 * 3600) / 3600)
        let min = Math.floor((second - day * 24 * 3600 - 3600 * hour) / 60)
        second = Math.floor(second - day * 24 * 3600 - 3600 * hour - min * 60)
        let timeStr = ''
        if (day > 0) {
          timeStr += (day + '天')
        }
        if (hour > 0) {
          timeStr += (hour + '小时')
        }
        if (min > 0) {
          timeStr += (min + '分')
        }
        if (second > 0) {
          timeStr += (second + '秒')
        }
        return timeStr
      },
      runnerManger (name, param) {
        if (name === 'update') {
          this.updateRunner(param)
        } else if (name === 'startStop') {
          this.startStopRunner(param)
        } else if (name === 'reset') {
          this.resetRunner(param)
        } else if (name === 'delete') {
          this.deleteRunner(param)
        }
      },
      showDetail (name, param) {
        if (name === 'errors') {
          this.showRunnerErrors(param.row.runnerError)
        } else if (name === 'config') {
          this.showRunnerConfig(param)
        }
      },
      showRunnerErrors (errors) {
        console.info(errors)
      },
      showRunnerConfig (param) {
        console.info(param.row.tag, param.row.url)
      },
      updateRunner (param) {
        console.info(param.row.tag, param.row.url)
      },
      startStopRunner (param) {
        console.info(param.row.tag, param.row.url)
      },
      resetRunner (param) {
        console.info(param.row.tag, param.row.url)
      },
      deleteRunner (param) {
        console.info(param.row.tag, param.row.url)
      }
    }
  }
</script>

<style scoped>
</style>
