import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client';
import titleMixin from './mixins/titleMixin'

// export const socketIo = io('http://localhost:3200/');
export const socketIo = io('https://icl-vote-service.herokuapp.com/');

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueSocketIOExt, socketIo);
Vue.mixin(titleMixin);

new Vue({
  router,
  store,
  beforeCreate () { this.$store.commit('initialiseStore') },
  render: h => h(App)
}).$mount('#app')

