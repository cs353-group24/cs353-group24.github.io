import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')                                           
  },
  {
    path: '/signup-next',
    name: 'Signup2',
    component: () => import('../views/Signup2.vue')                                           
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('../views/Twofactorauth.vue')                                           
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/Test.vue')                                           
  }
]

const router = new VueRouter({
  routes
})

export default router
