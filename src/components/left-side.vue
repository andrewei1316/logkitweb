<style scoped>
  .layout-logo-left{
    height: 35px;
    width: 52%;
    margin: 16px auto;
    background: #464c5b;
  }
  .layout-logo-left img{
    float: left;
    height: 35px;
    padding: auto auto;
    border-radius: 6px;
    background: #5b6270;
  }
  .ivu-tag-dot {
    border: 0px !important;
    color: rgba(255,255,255,.7) !important;
    background: transparent !important;
  }
</style>

<template>
  <Menu active-name="slave" theme="dark" width="auto">
    <div class="layout-logo-left"><img :src='imgUrl'/></div>
    <div v-if="slaves != null">
      <Submenu v-for="(data, tag) in slaves" :key="tag" :name="tag">
        <template slot="title">
          <Badge dot :count="data.abCount">
            <Icon type="ios-navigate"></Icon>
            {{ tag }} (共 {{ data.slave.length }} 台机器)
          </Badge>
        </template>
        <MenuItem v-for="s in data.slave" :key="s.url" :name="s.url" @click.native="onClick(tag, s.url)">
          {{ s.url }} <Tag class="ivu-tag-dot" type="dot" :color="s.color">{{ s.status }}</Tag>
        </MenuItem>
      </Submenu>
    </div>
  </Menu>
</template>

<script>
  const normalColor = 'green'
  const warnColor = 'yellow'
  const alertColor = 'red'
  export default {
    name: 'LeftSide',
    data: function () {
      return {
        slaves: null,
        statusTags: {
          'ok': normalColor,
          'bad': warnColor,
          'lost': alertColor
        },
        statusOk: normalColor,
        imgUrl: '../../static/logkit100.png'
      }
    },
    created: function () {
      let that = this
      that.request('getClusterSlaves', { url: '', tag: '' }, function (data) {
        let slaves = {}
        data.forEach((ele) => {
          let color = normalColor
          if (!(ele['tag'] in slaves)) {
            slaves[ele['tag']] = {abCount: 0, slave: []}
          }
          if (ele['status'] in that.statusTags) {
            color = that.statusTags[ele['status']]
            if (color !== normalColor) {
              slaves[ele['tag']].abCount++
            }
          }
          slaves[ele['tag']].slave.push({url: ele['url'], status: ele['status'], color: color})
        })
        that.slaves = slaves
      }, function () {}, '', '拉取集群信息失败')
    },
    methods: {
      onClick: function (tag, url) {
        let httpCount = 7
        if (url.substring(0, httpCount) === 'http://') {
          url = url.substring(7)
        }
        this.$router.push('/cluster/' + tag + '/' + url)
      }
    }
  }
</script>
