<template>
  <div>
    <Modal
      width="360"
      v-model="selectRunnerTypeModal"
      title="请选择要添加的收集器类型">
      <Form class="style-center">
        <FormItem>
        <Button type="ghost" @click="selectRunnerType('log')"> 添加日志收集器 </Button>
        </FormItem>
        <FormItem>
          <Button type="ghost" @click="selectRunnerType('metric')"> 添加系统信息收集器 </Button>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="closeAllModal">取消</Button>
      </div>
    </Modal>
    <Modal
      width="360"
      @on-ok="selectedRunner"
      :title="selectedRunnerTitle"
      v-model="selectRunnerModal">
      <Select v-model="runnerName" filterable>
        <Option v-for="item in runnerList" :value="item" :key="item">{{ item }}</Option>
      </Select>
      <Spin size="large" fix v-if="loading"></Spin>
    </Modal>
    <Modal
      width="360"
      v-model="removeClusterModal">
      <div slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </div>
      <div class="style-center">
        <p>删除集群并不能完全移除该集群下的机器, 当相应的机器发心跳注册时, 该集群会重新回到集群列表中, 确定删除这个集群吗?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="confirmRemove('Cluster')">删除</Button>
      </div>
    </Modal>
    <Modal
      width="360"
      @on-ok="renameCluster"
      title="输入新集群名称"
      v-model="renameClusterModal">
      <Input v-model="newClusterName" placeholder="请输入新集群名称"/>
    </Modal>
    <Modal
      width="360"
      v-model="removeSlaveModal">
      <div slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </div>
      <div class="style-center">
        <p>从集群中删除机器并不能完全移除该机器, 当机器发心跳注册时, 该机器会重新回到集群列表中, 确定删除这台机器吗?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="confirmRemove('Slave')">删除</Button>
      </div>
    </Modal>
    <Modal
      width="360"
      v-model="removeRunnerModal">
      <div slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </div>
      <div class="style-center">
        <p>确定删除这个收集器吗?</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="confirmRemove('Runner')">删除</Button>
      </div>
    </Modal>
    <Modal
      width="360"
      v-model="resetRunnerModal">
      <div slot="header" style="color:#ff9900; text-align:center">
        <Icon type="information-circled"></Icon>
        <span>确认重置</span>
      </div>
      <div class="style-center">
        <p>重置配置文件会删除 meta 信息并重启, 这意味着收集器会重新收集所有日志, 确定重置这个收集器吗?</p>
      </div>
      <div slot="footer">
        <Button type="warning" size="large" long @click="resetRunner">重置</Button>
      </div>
    </Modal>
    <Modal
      width="1000"
      title="查看配置文件"
      :styles="{top: '20px'}"
      v-model="showRunnerConfigModal">
      <pre v-html="runnerConfig"></pre>
      <Spin size="large" fix v-if="loading"></Spin>
      <div slot="footer">
        <Button type="ghost" @click="closeAllModal">关闭</Button>
      </div>
    </Modal>
    <Modal
      width="800"
      title="错误日志"
      v-model="showLogkitErrorsModal">
      <Collapse v-model="hasError">
        <Panel name="reader">
          reader 错误日志
          <p slot="content">{{ logkitError.reader }}</p>
        </Panel>
        <Panel name="parser">
          parser 错误日志
          <p slot="content">{{ logkitError.parser }}</p>
        </Panel>
        <Panel name="sender">
          sender 错误日志
          <p slot="content">{{ logkitError.sender }}</p>
        </Panel>
        <Panel name="logkit">
          logkit 错误日志
          <p slot="content">{{ logkitError.logkit }}</p>
        </Panel>
      </Collapse>
      <div slot="footer">
        <Button type="ghost" @click="closeAllModal">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    name: 'MsgModal',
    props: ['time', 'param', 'optName', 'runnerMgrName'],
    data: function () {
      return {
        hasError: [],
        logkitError: {},
        runnerName: '',
        runnerList: [],
        loading: false,
        runnerConfig: '',
        newClusterName: '',
        lastCall: this.time,
        selectedRunnerTitle: '',
        resetRunnerModal: false,
        removeSlaveModal: false,
        removeRunnerModal: false,
        selectRunnerModal: false,
        removeClusterModal: false,
        renameClusterModal: false,
        selectRunnerTypeModal: false,
        showRunnerConfigModal: false,
        showLogkitErrorsModal: false
      }
    },
    watch: {
      time: function (val) {
        this.time = val
        if (this.optName === 'addRunner') {
          this.selectRunnerTypeModal = true
        } else if (this.optName === 'renameCluster') {
          this.newClusterName = ''
          this.renameClusterModal = true
        } else if (this.optName === 'removeCluster') {
          this.removeClusterModal = true
        } else if (this.optName === 'removeSlave') {
          this.removeSlaveModal = true
        } else if (this.optName === 'removeRunner') {
          this.removeRunnerModal = true
        } else if (this.optName === 'resetRunner') {
          this.resetRunnerModal = true
        } else if (this.optName === 'selectRunner') {
          let that = this
          this.loading = true
          this.runnerName = ''
          let url = this.param.row.url
          let tag = this.param.row.tag
          this.selectRunnerModal = true
          this.selectedRunnerTitle = this.getSelectedTitle()
          that.request('getClusterRunners', { url: url, tag: tag }, function (data) {
            console.info(data)
            that.runnerList = data
            that.loading = false
          }, function () {
            that.loading = false
          }, '', '拉取收集器里列表失败')
        } else if (this.optName === 'runnerConfig') {
          let that = this
          this.loading = true
          this.runnerConfig = ''
          let rn = this.param.row.name
          let url = this.param.row.url
          let tag = this.param.row.tag
          this.showRunnerConfigModal = true
          that.request('getClusterConfig', { url: url, tag: tag, runnerName: rn }, function (data) {
            let jsonHtml = that.syntaxHighlight(JSON.stringify(data, undefined, 2))
            console.info(jsonHtml)
            that.runnerConfig = jsonHtml
            that.loading = false
          }, function () {
            that.loading = false
          }, '', '拉取收集器配置文件失败')
        } else if (this.optName === 'logkitErrors') {
          let hasError = []
          let logkitError = {}
          for (let key in this.param.row.runnerError) {
            if (this.param.row.runnerError[key]) {
              hasError.push(key)
            }
            logkitError[key] = this.param.row.runnerError[key]
          }
          this.hasError = hasError
          this.logkitError = logkitError
          this.showLogkitErrorsModal = true
        }
      }
    },
    methods: {
      closeAllModal () {
        this.resetRunnerModal = false
        this.removeSlaveModal = false
        this.removeRunnerModal = false
        this.selectRunnerModal = false
        this.removeClusterModal = false
        this.renameClusterModal = false
        this.selectRunnerTypeModal = false
        this.showRunnerConfigModal = false
        this.showLogkitErrorsModal = false
      },
      selectedRunner () {
        if (this.runnerName === '') {
          this.$Notice.error({
            title: '请选择一个收集器'
          })
        } else {
          this.$emit('selectedRunner', this.param, this.runnerMgrName, this.runnerName)
        }
      },
      selectRunnerType (selectType) {
        this.closeAllModal()
        this.$emit('addRunner', this.param, selectType)
      },
      renameCluster () {
        if (this.newClusterName === '') {
          this.$Notice.error({
            title: '集群名称不能为空'
          })
        } else {
          this.$emit('renameCluster', this.param, this.newClusterName)
        }
      },
      confirmRemove (opt) {
        this.closeAllModal()
        let eventName = 'remove' + opt
        this.$emit(eventName, this.param)
      },
      resetRunner () {
        this.closeAllModal()
        this.$emit('resetRunner', this.param)
      },
      getSelectedTitle () {
        let opt = ''
        if (this.runnerMgrName === 'update') {
          opt = '更新'
        } else if (this.runnerMgrName === 'start') {
          opt = '开启'
        } else if (this.runnerMgrName === 'stop') {
          opt = '关闭'
        } else if (this.runnerMgrName === 'reset') {
          opt = '重置'
        } else if (this.runnerMgrName === 'remove') {
          opt = '删除'
        }
        return '请选择要' + opt + '的收集器名称'
      },
      syntaxHighlight (json) {
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>')
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
          var cls = 'number'
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key'
            } else {
              cls = 'string'
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean'
          } else if (/null/.test(match)) {
            cls = 'null'
          }
          return '<span class="' + cls + '">' + match + '</span>'
        })
      }
    }
  }
</script>

<style scoped>
  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
  .string { color: green; }
  .number { color: darkorange; }
  .boolean { color: blue; }
  .null { color: magenta; }
  .key { color: red; }
  .style-center {
    text-align: center;
  }
</style>
