<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
  }
  .layout-copy{
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    background: #464c5b;
  }
  .layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
  }
</style>
<template>
  <div class="layout">
    <Row type="flex">
      <Col span="5" class="layout-menu-left">
        <LeftSide></LeftSide>
      </Col>
      <Col span="19">
      <div class="layout-header"></div>
      <router-view name="main"></router-view>
      <div class="layout-copy">
        2011-2016 &copy; TalkingData
      </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import LeftSide from './components/left-side'

  export default {
    components: {
      LeftSide
    },
    name: 'App'
  }
</script>
