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
  },
  {
    path: '/patient',
    name: 'Patient',
    component: () => import('../views/Patient.vue')                                           
  },
  {
    path: '/patient/past-appointments',
    name: 'Past-Appointments',
    component: () => import('../views/PastAppointments.vue')                                           
  },
  {
    path: '/patient/appointments',
    name: 'Appointments',
    component: () => import('../views/Appointments.vue')                                           
  },
  {
    path: '/patient/tests',
    name: 'Tests',
    component: () => import('../views/Tests.vue')                                           
  },
  {
    path: '/patient/prescriptions',
    name: 'Precriptions',
    component: () => import('../views/Prescriptions.vue')                                           
  },
  {
    path: '/doctor',
    name: 'Doctor',
    component: () => import('../views/Doctor.vue')                                           
  },
  {
    path: '/doctor/appointments',
    name: 'Doctor Appointments',
    component: () => import('../views/DAppointments.vue')                                           
  },
  {
    path: '/doctor/plans',
    name: 'Doctor Plans',
    component: () => import('../views/DoctorPlans.vue')                                           
  },
  {
    path: '/laboratorian',
    name: 'Laboratorian',
    component: () => import('../views/Laboratorian.vue')
  },
  {
    path: '/laboratorian/edit/:id',
    name: 'Edit',
    component: () => import('../views/TestEdit.vue')
  },
  {
    path: '/laboratorian/tests',
    name: 'Laboratorian Tests',
    component: () => import('../views/LabTests.vue')
  },
  {
    path: '/laboratorian/prev-tests',
    name: 'Laboratorian Prev-Tests',
    component: () => import('../views/LabPrevTests.vue')
  },

]

const router = new VueRouter({
  routes
})

export default router
