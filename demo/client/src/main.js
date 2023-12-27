import Vue from 'vue'
import App from './App.vue'
import router from './router';
import ElementUI from 'element-ui';
import * as echarts from 'echarts';
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI);
Vue.prototype.$echarts = echarts //引入组件
Vue.config.productionTip = false

new Vue({
  router,
  ElementUI,
  render: h => h(App),
}).$mount('#app')
