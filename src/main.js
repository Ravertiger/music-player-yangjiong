import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import Toast from "vue-toastification"
import 'vue-toastification/dist/index.css'; // 引入样式

Vue.config.productionTip = false

const options = {
  // 配置提示框的设置
  position: 'bottom-right',
  timeout: 2500,
};
Vue.use(Toast, options);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
