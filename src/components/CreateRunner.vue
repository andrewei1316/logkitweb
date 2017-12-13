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
    }
  }
</script>

<style scoped>
</style>
