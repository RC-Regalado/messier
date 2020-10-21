import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import VueMaterial from 'vue-material-adapter'
import { VueSvgIcon } from '@yzfe/vue-svgicon'
import CompositionApi from '@vue/composition-api'
import { VTooltip } from 'v-tooltip'
import '@yzfe/svgicon/lib/svgicon.css'

Vue.use(CompositionApi)
// Vue.use(VTooltip)
Vue.directive('tooltip', VTooltip)
Vue.config.productionTip = false
Vue.use(VueMaterial)
Vue.component('icon', VueSvgIcon)

const vm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

export default vm
