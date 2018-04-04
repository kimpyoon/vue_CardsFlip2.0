// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Notice from '@/components/common/Notice.vue'
import '../static/css/base.css'
import '../static/css/iconfont.css'
import VueAxios from 'vue-axios'
import Router from 'vue-router'
import axios from 'axios'
import animate from 'animate.css'
import touch from 'vue-directive-touch'
Vue.use(touch)
Vue.use(animate)
Vue.use(Router)
Vue.use(VueAxios, axios)

const routes = [{
    path: '/',
    component: App,
    name: 'CardsFlip'
}]

const router = new Router({
    routes
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
