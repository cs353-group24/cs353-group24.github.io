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
    path: '/laboratorian/prep-tests',
    name: 'Laboratorian Tests',
    component: () => import('../views/LabTests.vue')
  },
  {
    path: '/laboratorian/done-tests',
    name: 'Laboratorian Done-Tests',
    component: () => import('../views/LabDoneTests.vue')
  },
  {
    path: '/pharmacist',
    name: 'Pharmacist',
    component: () => import('../views/Pharmacist.vue')
  },
  {
    path: '/pharmacist/prescriptions',
    name: 'Pharmacist Prescriptions',
    component: () => import('../views/PharmacistPres.vue')
  },
  {
    path: '/pharmacist/inventory',
    name: 'Pharmacist Inventory',
    component: () => import('../views/PharmacistInventory.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue')
  },
  {
    path: '/admin/tests',
    name: 'Admin Tests',
    component: () => import('../views/AdminTests.vue')
  },
  {
    path: '/admin/diseases',
    name: 'Admin Diseases',
    component: () => import('../views/AdminDiseases.vue')
  },
  {
    path: '/admin/symptoms',
    name: 'Admin Symptoms',
    component: () => import('../views/AdminSymptoms.vue')
  },
  {
    path: '/admin/medicine',
    name: 'Admin Medicine',
    component: () => import('../views/AdminMedicine.vue')
  },
  {
    path: '/admin/components',
    name: 'Admin Components',
    component: () => import('../views/AdminComponents.vue')
  },
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

export default router
