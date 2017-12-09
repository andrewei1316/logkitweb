import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/home'
import ClusterList from '../components/cluster-list'
import SlaveList from '../components/slave-list'
import RunnerList from '../components/runner-list'

Vue.use(Router)

export default new Router({
  routes: [
    {path: '/', components: { main: Home }},
    {path: '/cluster', components: { main: ClusterList }},
    {path: '/cluster/:tag', components: { main: SlaveList }, props: {main: true}},
    {path: '/cluster/:tag/:url', components: { main: RunnerList }, props: {main: true}}
  ]
})
