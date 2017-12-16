<template>
  <div>
    <div> <h3>机器管理列表</h3><br/> </div>
    <Table :loading="loading" :data="tableData" :columns="tableColumns" stripe></Table>
    <div style="margin: 10px;overflow: hidden">
      <div style="float: right;">
        <Page :total="1" :current="1" @on-change="changePage"></Page>
      </div>
    </div>
    <MsgModal
      v-bind="msgParam"
      v-on:addRunner="addRunner"
      v-on:removeSlave="removeSlave"
      v-on:renameCluster="renameSlave">
    </MsgModal>
  </div>
</template>

<script>
  import {formatDate} from '../common/utils'
  import MsgModal from './MsgModal'
  const alertColor = 'red'
  const warnColor = 'yellow'
  const normalColor = 'green'
  export default {
    name: 'SlaveList',
    data: function () {
      return {
        url: '',
        tag: '',
        loading: false,
        allSlaves: [],
        tableData: [],
        msgParam: {},
        tableColumns: [
          {
            title: '机器地址',
            key: 'url',
            render: (h, param) => {
              return h('a', {
                props: { },
                on: {
                  click: () => {
                    this.showRunners(param)
                  }
                }
              }, param.row.url)
            }
          },
          {
            title: '所属集群',
            key: 'tag'
          },
          {
            title: '机器状态',
            key: 'slaveStatus',
            render: (h, param) => {
              return h('Tag', {
                props: {
                  type: 'dot',
                  color: param.row.color
                },
                style: {
                  border: '0px !important',
                  background: 'transparent !important'
                }
              }, param.row.status)
            }
          },
          {
            title: '心跳时间',
            key: 'lastTouch'
          },
          {
            title: '操作',
            key: 'slavesMgr',
            align: 'center',
            width: 200,
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
                    icon: 'trash-a'
                  },
                  on: {
                    click: () => {
                      this.showModal('removeSlave', param)
                    }
                  }
                })
              ])
            }
          }
        ],
        statusTags: {
          'ok': normalColor,
          'bad': warnColor,
          'lost': alertColor
        }
      }
    },
    components: {MsgModal},
    created: function () {
      this.reLoad()
    },
    watch: {
      '$route': 'reLoad'
    },
    methods: {
      reLoad () {
        this.url = this.$route.query.url
        this.tag = this.$route.query.tag
        this.fetchData()
      },
      fetchData () {
        let that = this
        that.loading = true
        that.request('getClusterSlaves', { url: this.url, tag: this.tag }, function (data) {
          let allSlaves = []
          data.forEach((ele) => {
            let color = normalColor
            if (ele['status'] in that.statusTags) {
              color = that.statusTags[ele['status']]
            }
            let lastTouch = ele['last_touch']
            let crtTime = formatDate(new Date(lastTouch), 'yyyy-MM-dd hh:mm:ss')

            allSlaves.push({url: ele['url'], tag: ele['tag'], status: ele['status'], color: color, lastTouch: crtTime})
          })
          that.allSlaves = allSlaves
          that.mockTableData(1)
          that.loading = false
          that.total = that.allSlaves.length / 10 + that.allSlaves.length % 10
        }, function () {
          that.loading = false
        }, '', '拉取收集器状态失败')
      },
      mockTableData (page) {
        let tableData = []
        if (page < 0) page = 0
        for (let i = (page - 1) * 10; i < page * 10 && i < this.allSlaves.length; i++) {
          tableData.push(this.allSlaves[i])
        }
        this.tableData = tableData
      },
      changePage (curPage) {
        this.mockTableData(curPage)
      },
      showRunners (param) {
        let url = param.row.url
        let tag = param.row.tag
        this.$router.push({name: 'runners', query: {tag: tag, url: url}})
      },
      renameSlave (param, clusterName) {
        console.info(param, clusterName)
      },
      addRunner (param, runnerType) {
        this.$router.push({
          name: 'create',
          params: {
            type: runnerType,
            tag: param.row.tag,
            url: param.row.url
          }
        })
      },
      removeSlave (param) {
        console.info(param)
      },
      showModal (optName, param) {
        this.msgParam = {time: new Date(), optName: optName, param: param}
      }
    }
  }
</script>

<style scoped>
</style>
