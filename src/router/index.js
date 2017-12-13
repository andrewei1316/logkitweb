import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home'
import SlaveList from '../components/SlaveList'
import RunnerList from '../components/RunnerList'
import ClusterList from '../components/ClusterList'
import CreateRunner from '../components/CreateRunner'

Vue.use(Router)

export default new Router({
  routes: [
    {name: 'home', path: '/', components: {main: Home}, props: {main: true}},
    {name: 'slaves', path: '/slaves', components: {main: SlaveList}, props: {main: true}},
    {name: 'runners', path: '/runners', components: {main: RunnerList}, props: {main: true}},
    {name: 'cluster', path: '/cluster', components: {main: ClusterList}, props: {main: true}},
    {name: 'create', path: '/create/', components: { main: CreateRunner }, props: {main: true}}
  ]
})
