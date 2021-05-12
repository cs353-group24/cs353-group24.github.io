import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'

Vue.config.productionTip = false
Vue.prototype.$http = axios;
Vue.prototype.$url = "http://localhost:8079";

Vue.mixin({
  methods: {
    toIsoString: function(date) {
      var tzo = -date.getTimezoneOffset(),
          dif = tzo >= 0 ? '+' : '-',
          pad = function(num) {
              var norm = Math.floor(Math.abs(num));
              return (norm < 10 ? '0' : '') + norm;
          };

      return date.getFullYear() +
          '-' + pad(date.getMonth() + 1) +
          '-' + pad(date.getDate()) +
          'T' + pad(date.getHours()) +
          ':' + pad(date.getMinutes()) +
          ':' + pad(date.getSeconds()) +
          dif + pad(tzo / 60) +
          ':' + pad(tzo % 60);
    },
  },
})

new Vue({
  vuetify,
  axios,
  router,
  render: h => h(App)
}).$mount('#app')
