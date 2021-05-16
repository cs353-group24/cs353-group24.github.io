import Vue from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
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
    capitalise: function(name, surname = "")
    {
      let last = (surname ? (' ' + surname.charAt(0).toUpperCase() + surname.slice(1)): "")
      return name.charAt(0).toUpperCase() + name.slice(1) + last
    },
    lower: function(name, surname = "")
    {
      let last = (surname ? (' ' + surname.charAt(0).toLowerCase() + surname.slice(1)): "")
      return name.charAt(0).toLowerCase() + name.slice(1) + last
    }
  },
})

Vue.use(VueCookies)

new Vue({
  VueCookies,
  vuetify,
  axios,
  router,
  render: h => h(App)
}).$mount('#app')
