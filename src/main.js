import Vue from 'vue'
import App from './App.vue'
import msal from 'vue-msal'

Vue.config.productionTip = false

Vue.use(msal, {
  auth: {
    clientId: '3a0002a4-b71c-48a0-8a05-215478deff51',
    tenantId: '3c527d9d-2e0a-4d0f-b310-8ee8e4b90345',
    redirectUri: 'http://localhost:8080/'
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')
