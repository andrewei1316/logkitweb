<template>
  <div class="">
    <Steps :current="current">
      <Step title="步骤1"></Step>
      <Step title="步骤2"></Step>
      <Step title="步骤3"></Step>
      <Step title="步骤4"></Step>
    </Steps>
  </div>
</template>

<script>
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
