<template>
  <div>
    <div class="layout-breadcrumb">
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/cluster">cluster</BreadcrumbItem>
        <BreadcrumbItem :href="clusterUrl">{{ tag }}</BreadcrumbItem>
        <BreadcrumbItem href="#">{{ url }}</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="layout-content">
      <div class="layout-content-main">
        <div> <h3>收集器管理列表</h3><br/> </div>
        <Table :loading="loading" :data="tableData" :columns="tableColumns" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="10" :current="1" @on-change="changePage"></Page>
          </div>
        </div>
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
            title: '收集器名称',
            key: 'name'
          },
          {
            title: '所属集群',
            key: 'tag'
          },
          {
            title: '所属机器',
            key: 'url'
          },
          {
            title: '运行时间',
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
            title: '错误日志',
            key: 'runnerError',
            align: 'center',
            width: 86,
            render: (h, param) => {
              let type = 'checkmark-circled'
              let color = 'Light Primary'
              let errors = param.row.runnerError
              if (errors.parser + errors.reader + errors.sender !== '') {
                type = 'information-circled'
                color = 'red'
              }
              return h('Span', {
                on: {
                  click: () => {
                    this.showRunnerErrors(errors)
                  }
                }
              }, [
                h('Icon', {
                  props: {
                    type: type,
                    size: 22,
                    color: color
                  }
                })
              ])
            }
          },
          {
            title: '查看配置',
            key: 'runnerConfig',
            align: 'center',
            width: 86,
            render: (h, param) => {
              return h('Span', {
                on: {
                  click: () => {
                    this.showRunnerConfig(param)
                  }
                }
              }, [
                h('Icon', {
                  props: {
                    type: 'document-text',
                    size: 22,
                    color: 'Light Primary'
                  }
                })
              ])
            }
          },
          {
            title: '操作',
            key: 'slavesMgr',
            align: 'center',
            width: 260,
            render: (h, param) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: 'edit'
                  },
                  on: {
                    click: () => {
                      this.updateRunner(param)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: param.row.statusIcon
                  },
                  on: {
                    click: () => {
                      this.startStopRunner(param)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: 'refresh'
                  },
                  on: {
                    click: () => {
                      this.resetRunner(param)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: 'trash-a'
                  },
                  on: {
                    click: () => {
                      this.removeRunner(param)
                    }
                  }
                })
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
        return 'http://' + this.url
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
          if (this.tag !== '' && ele.key === 'tag') {
            return true
          }
          if (this.url !== '' && ele.key === 'url') {
            return true
          }
          tableColumns.push(ele)
        })
        this.tableColumns = tableColumns
      },
      showRunnerErrors (errors) {
        console.info(errors)
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
      removeRunner (param) {
        console.info(param.row.tag, param.row.url)
      }
    }
  }
</script>

<style scoped>
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
</style>
