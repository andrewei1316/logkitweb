import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import ClusterList from '../components/ClusterList'
import SlaveList from '../components/SlaveList'
import RunnerList from '../components/RunnerList'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', components: { main: Home }},
    {path: '/slaves', components: { main: SlaveList }},
    {path: '/runners', components: { main: RunnerList }},
    {path: '/cluster', components: { main: ClusterList }},
    {path: '/cluster/:tag', components: { main: SlaveList }, props: {main: true}},
    {path: '/cluster/:tag/:url', components: { main: RunnerList }, props: {main: true}}
  ]
})
