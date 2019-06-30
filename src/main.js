import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'



import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'
import './assets/css/navbar.css'

Vue.config.productionTip = false

Vue.use(infiniteScroll)
Vue.use(VueRouter)
Vue.use(VueLazyLoad,{
  error:'@/assets/logo.png',
  loading:'@/assets/logo.png',
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
