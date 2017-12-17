<template>
  <div>
    <Row v-if="type==='log'">
      <Col span="16" offset="4">
      <Steps :current="current" width="100%">
        <Step title="配置数据源"></Step>
        <Step title="配置解析方式"></Step>
        <Step title="添加Transformer"></Step>
        <Step title="配置发送方式"></Step>
        <!--<Step title="配置发送路由规则"></Step>-->
        <Step title="确认并添加收集器"></Step>
      </Steps>
      </Col>
    </Row>
    <Row v-else-if="type==='metric'">
      <Col span="16" offset="4">
      <Steps :current="current" width="100%">
        <Step title="信息类型配置"></Step>
        <Step title="配置发送方式"></Step>
        <Step title="确认并添加收集器"></Step>
      </Steps>
      </Col>
    </Row>
    <Row>
      <div v-if="current===0 && type==='log'"><Reader></Reader></div>
      <div v-if="current===1 && type==='log'"><Parser></Parser></div>
      <div v-if="current===2 && type==='log'"><Transformer></Transformer></div>
      <div v-if="current===3 && type==='log'"><Sender></Sender></div>
      <div v-if="current===4 && type==='log'"><Confirm></Confirm></div>
      <div v-if="current===0 && type==='metric'"><Metrics></Metrics></div>
      <div v-if="current===1 && type==='metric'"><Sender></Sender></div>
      <div v-if="current===2 && type==='metric'"><Confirm></Confirm></div>
    </Row>
    <Row>
      <Button type="primary" style="margin-left: 10px" @click="current = (current + 4) % 5">上一步</Button>
      <Button type="primary" style="margin-right: 10px; float: right;"@click="current = (current + 1) % 5">下一步</Button>
    </Row>
  </div>
</template>

<script>
  import Reader from './create/Reader'
  import Parser from './create/Parser'
  import Sender from './create/Sender'
  import Confirm from './create/Confirm'
  import Metrics from './create/Metrics'
  import Transformer from './create/Transformer'
  export default {
    name: 'CreateRunner',
    data: function () {
      return {
        type: '',
        url: '',
        tag: '',
        current: 0
      }
    },
    components: {Reader, Parser, Sender, Metrics, Confirm, Transformer},
    created: function () {
      this.reLoad()
    },
    watch: {
      '$route': 'reLoad'
    },
    methods: {
      reLoad () {
        this.url = this.$route.params.url
        this.tag = this.$route.params.tag
        this.type = this.$route.params.type
        if (this.type !== 'log' && this.type !== 'metric') {
          this.$Notice.error({
            title: '未知收集器类型 ' + this.type
          })
        }
      }
    }
  }
</script>

<style scoped>
</style>
