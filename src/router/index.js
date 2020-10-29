import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Designer from '../views/Designer'
import Editor from '../views/Editor'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/designer',
    name: 'designer',
    component: Designer
  },
  {
    path: '/editor',
    name: 'editor',
    component: Editor
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
