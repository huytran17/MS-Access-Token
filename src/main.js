import Vue from 'vue'
import App from './App.vue'
import randomstring from 'randomstring'

Vue.config.productionTip = false

Object.defineProperty(Vue.prototype, "$randomstring", { value: randomstring })

new Vue({
  render: h => h(App),
}).$mount('#app')
