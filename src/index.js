import './style.css'
import App from './App.vue'
import store from './store'
import Vue from "vue";
import router from './router/router'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount("#app");