import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { VueSvgIcon } from '@yzfe/vue-svgicon'
import { VTooltip } from 'v-tooltip'
import '@yzfe/svgicon/lib/svgicon.css'
import vuetify from './plugins/vuetify'

Vue.directive('tooltip', VTooltip)
Vue.config.productionTip = false

Vue.component('icon', VueSvgIcon)

const vm = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')

export default vm
