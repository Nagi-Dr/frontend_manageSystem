import Vue from 'vue'
import Router from 'vue-router'
import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'
import moment from 'moment'
import '@/styles/element-variables.scss'
import 'vue-area-linkage/dist/index.css'

import * as echarts from 'echarts'

import App from '@/App.vue'
import store from '@/store/index'
import router from '@/router'
import '@/permission'
import { checkProcessEnv } from '@/utils/common'

Vue.use(ElementUI)
Vue.use(SvgIcon, {
  'tagName': 'svg-icon',
  'defaultWidth': '1em',
  'defaultHeight': '1em'
})

Vue.config.productionTip = false
Vue.prototype.moment = moment
Vue.prototype.$checkProcessEnv = checkProcessEnv
const routerPush = Router.prototype.push
Router.prototype.push = function push(location: any) {
 return routerPush.call(this, location).catch((error: any) => error)
}
Vue.prototype.$echarts = echarts
new Vue({
  router,
  store,
  'render': (h) => h(App)
}).$mount('#app')
