<template>
  <div class="layout-nav" v-if="model === 'show'">
    <MenuItem name="cluster" @click.native="onClick('cluster')">
      <Icon type="ios-navigate" href="/cluster"></Icon>
      层级展示
    </MenuItem>
    <MenuItem name="slaves" @click.native="onClick('slaves')">
      <Icon type="ios-keypad"></Icon>
      机器列表
    </MenuItem>
    <MenuItem name="runners" @click.native="onClick('runners')">
      <Icon type="ios-analytics"></Icon>
      收集器列表
    </MenuItem>
  </div>
  <div class="layout-nav" v-else-if="model === 'edit'">
    <MenuItem name="create-padding" class="padding-hidden">
      <Icon type="ios-analytics"></Icon>
      收集器列表
    </MenuItem>
    <MenuItem name="create">
      <Icon type="ios-keypad"></Icon>
      编辑收集器
    </MenuItem>
  </div>
</template>

<script>
  export default {
    name: 'NavBar',
    props: ['model'],
    data: function () {
      return {
      }
    },
    methods: {
      onClick (name) {
        this.$router.push('/' + name)
      }
    }
  }
</script>

<style scoped>
  .layout-nav{
    width: 420px;
    margin: 0 auto;
  }
  .padding-hidden {
    color: #495060 !important;
  }
</style>
