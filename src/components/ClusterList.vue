<template>
  <div>
    <div> <h3>集群管理列表</h3><br/> </div>
    <Table :loading="loading" :data="tableData" :columns="tableColumns" stripe></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="1" :current="1" @on-change="changePage"></Page>
      </div>
    </div>
    <MsgModel
      v-bind="msgParam"
      v-on:addRunner="addRunner"
      v-on:renameCluster="renameCluster"
      v-on:removeCluster="removeCluster"
      v-on:selectedRunner="selectedRunner"
    ></MsgModel>
  </div>
</template>

<script>
  import MsgModel from './MsgModal'
  const alertColor = 'red'
  const warnColor = 'yellow'
  const normalColor = 'green'
  export default {
    name: 'ClusterList',
    components: {MsgModel},
    data: function () {
      return {
        total: 1,
        current: 1,
        loading: false,
        allData: [],
        msgParam: {},
        tableData: [],
        statusOk: normalColor,
        statusTags: {
          'ok': normalColor,
          'bad': warnColor,
          'lost': alertColor
        },
        tableColumns: [
          {
            title: '集群名称',
            key: 'tag',
            render: (h, param) => {
              return h('a', {
                props: { },
                on: {
                  click: () => {
                    this.showSlaves(param)
                  }
                }
              }, param.row.tag)
            }
          },
          {
            title: '机器数量',
            key: 'slaveCount'
          },
          {
            title: '机器状态',
            key: 'slaveStatus',
            render: (h, param) => {
              let bad = 0
              let color = 'green'
              let text = '一切正常'
              param.row.slaves.forEach((s) => {
                if (s.status !== 'ok') bad++
              })
              if (bad) {
                color = 'yellow'
                text = bad + '台机器异常'
              }
              return h('Span', {
                on: {
                  '!click': () => {
                    this.showSlaves(param)
                  }
                }
              }, [
                h('Tag', {
                  props: {
                    type: 'dot',
                    color: color
                  },
                  style: {
                    border: '0px !important',
                    background: 'transparent !important'
                  }
                }, text)
              ])
            }
          },
          {
            title: '集群操作',
            key: 'clusterMgr',
            width: 150,
            align: 'center',
            render: (h, param) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: 'compose'
                  },
                  on: {
                    click: () => {
                      this.showModal('renameCluster', param)
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
                      this.showModal('removeCluster', param)
                    }
                  }
                })
              ])
            }
          },
          {
            title: '收集器操作',
            key: 'runnerMgr',
            width: 300,
            align: 'center',
            render: (h, param) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: 'plus'
                  },
                  on: {
                    click: () => {
                      this.showModal('addRunner', param)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: 'wrench'
                  },
                  on: {
                    click: () => {
                      this.showSelectedModal('update', param)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: 'play'
                  },
                  on: {
                    click: () => {
                      this.showSelectedModal('start', param)
                    }
                  }
                }),
                h('Button', {
                  props: {
                    type: 'ghost',
                    icon: 'stop'
                  },
                  on: {
                    click: () => {
                      this.showSelectedModal('stop', param)
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
                      this.showSelectedModal('reset', param)
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
                      this.showSelectedModal('remove', param)
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
    methods: {
      fetchData () {
        let that = this
        that.loading = true
        let url = this.$route.query.url
        let tag = this.$route.query.tag
        that.request('getClusterSlaves', { url: url, tag: tag }, function (data) {
          let allSlaves = {}
          data.forEach((ele) => {
            let color = normalColor
            if (ele['status'] in that.statusTags) {
              color = that.statusTags[ele['status']]
            }
            if (!(ele['tag'] in allSlaves)) {
              allSlaves[ele['tag']] = []
            }
            allSlaves[ele['tag']].push({url: ele['url'], status: ele['status'], color: color})
          })
          let allData = []
          for (let tag in allSlaves) {
            allData.push({tag: tag, slaveCount: allSlaves[tag].length, slaves: allSlaves[tag]})
          }
          that.allData = allData
          that.mockTableData(1)
          that.loading = false
          that.total = that.allData.length / 10 + that.allData.length % 10
        }, function () {
          that.loading = false
        }, '', '拉取集群信息失败')
      },
      mockTableData (page) {
        let tableData = []
        if (page < 0) page = 0
        for (let i = (page - 1) * 10; i < page * 10 && i < this.allData.length; i++) {
          tableData.push(this.allData[i])
        }
        this.tableData = tableData
      },
      changePage (curPage) {
        this.mockTableData(curPage)
      },
      showSlaves (param) {
        this.$router.push({name: 'slaves', query: {tag: param.row.tag}})
      },
      renameCluster (param, clusterName) {
        console.info(param, clusterName)
      },
      removeCluster (param) {
        console.info(param.row.tag)
      },
      addRunner (param, runnerType) {
        console.info(param, runnerType)
      },
      selectedRunner (param, mgrName, runnerName) {
        if (mgrName === 'update') {
          this.updateRunner(param, runnerName)
        } else if (mgrName === 'start') {
          this.startRunner(param, runnerName)
        } else if (mgrName === 'stop') {
          this.stopRunner(param, runnerName)
        } else if (mgrName === 'reset') {
          this.resetRunner(param, runnerName)
        } else if (mgrName === 'remove') {
          this.removeRunner(param, runnerName)
        }
      },
      updateRunner (param, runnerName) {
        console.info(param, runnerName)
      },
      startRunner (param, runnerName) {
        console.info(param, runnerName)
      },
      stopRunner (param, runnerName) {
        console.info(param, runnerName)
      },
      resetRunner (param, runnerName) {
        console.info(param, runnerName)
      },
      removeRunner (param, runnerName) {
        console.info(param, runnerName)
      },
      showModal (optName, param) {
        this.msgParam = {time: new Date(), optName: optName, param: param}
      },
      showSelectedModal (mgrName, param) {
        this.msgParam = {time: new Date(), optName: 'selectRunner', param: param, 'runnerMgrName': mgrName}
      }
    }
  }
</script>

<style scoped>
</style>
