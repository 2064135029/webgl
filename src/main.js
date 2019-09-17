import Vue from 'vue'
import App from './App.vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import router from './router';
import store from './store';
// import 'style-loader!css-loader!./style.css';
// require("style-loader!css-loader!");
Vue.config.productionTip = false
Vue.use(Vant);
new Vue({
    router,
    store,
  render: h => h(App),
}).$mount('#app')
