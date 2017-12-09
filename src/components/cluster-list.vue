<template>
  <div>
    <div class="layout-breadcrumb">
      <Breadcrumb>
        <BreadcrumbItem href="/">Home</BreadcrumbItem>
        <BreadcrumbItem href="/cluster">cluster</BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="layout-content">
      <div class="layout-content-main">
        <div> <h3>集群管理列表</h3><br/> </div>
        <Table :loading="loading" :data="tableData" :columns="tableColumns" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
          <div style="float: right;">
            <Page :total="1" :current="1" @on-change="changePage"></Page>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const alertColor = 'red'
  const warnColor = 'yellow'
  const normalColor = 'green'
  export default {
    name: 'ClusterList',
    data: function () {
      return {
        total: 1,
        current: 1,
        loading: false,
        allData: [],
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
                      this.renameCluster(param)
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
                      this.removeCluster(param)
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
                      this.addRunner(param)
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
                      this.updateRunner(param)
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
                      this.startRunner(param)
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
                      this.stopRunner(param)
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
                      this.deleteRunner(param)
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
        that.request('getClusterSlaves', { url: '', tag: '' }, function (data) {
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
        this.$router.push('/cluster/' + param.row.tag)
      },
      renameCluster (param) {
        let newTagName = ''
        this.$Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          onOk: function () {
            console.info(newTagName)
          },
          render: (h) => {
            return h('Input', {
              props: {
                autofocus: true,
                placeholder: '输入集群新名称...'
              },
              on: {
                input: (val) => {
                  newTagName = val
                }
              }
            })
          }
        })
      },
      removeCluster (param) {
        console.info(param.row.tag)
      },
      addRunner (param) {
        console.info(param.row.tag)
      },
      updateRunner (param) {
        console.info(param.row.tag)
      },
      startRunner (param) {
        console.info(param.row.tag)
      },
      stopRunner (param) {
        console.info(param.row.tag)
      },
      resetRunner (param) {
        console.info(param.row.tag)
      },
      deleteRunner (param) {
        console.info(param.row.tag)
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
