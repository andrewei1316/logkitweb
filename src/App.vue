<template>
  <div class="layout">
    <Menu mode="horizontal" theme="dark" active-name="1">
      <div class="layout-logo"><a href="/"><img :src="imgUrl"/></a></div>
      <NavBar :model="model"></NavBar>
      <div class="layout-version">logkit 版本: {{ version }}</div>
    </Menu>
    <div class="layout-breadcrumb" v-if="model === 'show'">
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
  import NavBar from './components/NavBar'
  export default {
    name: 'App',
    components: {NavBar},
    data: function () {
      return {
        bread: [],
        version: '',
        model: 'show',
        imgUrl: '/static/logkit100.png'
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
        let tag = this.$route.query.tag
        let url = this.$route.query.url
        let fullPath = this.$route.fullPath.split('?')[0]
        let urlSplit = fullPath.split('/')
        let curUrl = ''
        urlSplit.map((ele, index) => {
          if (ele === 'create') {
            this.model = 'edit'
          }
          console.info(index, ele)
          if (index === 0) {
            bread.push({url: '/', name: 'Home'})
          } else if (index === 1 && ele !== '') {
            if (tag || url) {
              curUrl = '/cluster'
              bread.push({url: curUrl, name: 'cluster'})
            } else {
              curUrl = '/' + ele
              bread.push({url: curUrl, name: ele})
            }
            if (tag) {
              curUrl = '/slaves?tag=' + tag
              bread.push({url: curUrl, name: tag})
            }
            if (url) {
              curUrl = '/runners?url=' + url
              bread.push({url: curUrl, name: url})
            }
          }
        })
        this.bread = bread
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
