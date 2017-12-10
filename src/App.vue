<template>
  <div class="layout">
    <Menu mode="horizontal" theme="dark" active-name="1">
      <div class="layout-logo"><a href="/"><img :src="imgUrl"/></a></div>
      <div class="layout-nav">
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
      <div class="layout-version">logkit 版本: {{ version }}</div>
    </Menu>
    <div class="layout-breadcrumb">
      <Breadcrumb>
        <BreadcrumbItem v-for="(u, i) in bread" :href="u.url" :key="i">
          {{ u.name }}
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
    <div class="layout-content">
      <div class="layout-content-main">
        <router-view name="main"></router-view>
      </div>
    </div>
    <Footer>
      <div class="layout-copy">
      2011-2016 &copy; TalkingData
      </div>
    </Footer>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data: function () {
      return {
        bread: [],
        version: '',
        imgUrl: '../../static/logkit100.png'
      }
    },
    created: function () {
      this.updateBread()
      let that = this
      this.request('getLogkitVersion', {}, function (data) {
        that.version = data.version
      }, function () {}, '', '获取 logkit version 失败')
    },
    watch: {
      '$route': 'updateBread'
    },
    methods: {
      updateBread: function () {
        let bread = []
        let curUrl = '/'
        this.$route.fullPath.split('/').map((ele, index) => {
          curUrl += ele
          bread.push({url: curUrl, name: index === 0 ? 'Home' : ele})
          if (ele !== '') curUrl += '/'
        })
        this.bread = bread
      },
      onClick (name) {
        this.$router.push('/' + name)
      }
    }
  }
</script>

<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }
  .layout-logo{
    border-radius: 3px;
    float: left;
    position: relative;
    top: 10px;
    left: 20px;
  }
  .layout-logo img {
    width: 110px;
    height: 28px;
  }
  .layout-nav{
    width: 420px;
    margin: 0 auto;
  }
  .layout-version {
    float: right;
    color: #bbbec4;
    font-size: 16px;
    margin-right: 20px;
  }
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
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
</style>
