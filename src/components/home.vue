<template>
  <div>
    <div> <h3>主页</h3><br/> </div>
    <router-link to="/cluster"> 转到集群管理页面 </router-link><br/>
    <router-link to="/slaves"> 转到机器列表页面 </router-link><br/>
    <router-link to="/runners"> 转到收集器列表页面 </router-link><br/>
  </div>
</template>

<script>
  export default {
    name: 'Home'
  }
</script>

<style scoped>
</style>
