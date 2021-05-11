<template>
  <v-app>
    <SideBar :items="items" v-if="($router.currentRoute.path.includes('/patient'))"/>
    <SideBar :items="itemsDoctor" v-if="($router.currentRoute.path.includes('/doctor'))"/>
    <SideBar :items="laboratorianList" v-if="($router.currentRoute.path.includes('/laboratorian'))"/>
    <SideBar :items="pharmacistList" v-if="($router.currentRoute.path.includes('/pharmacist'))"/>
    <SideBar :items="adminList" v-if="($router.currentRoute.path.includes('/admin'))"/>
    <v-app-bar app flat color="F7FAFB" class="mb-15">
        <v-toolbar-title class="font-weight-bold datatablefontcolor--text" :style="{marginLeft: (3 - (($router.currentRoute.path.includes('/patient')) ? 1 : 0)) + 'em'}">Hospital Database Management System</v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link to="/test">Test</router-link>
        <router-link class="ml-5" to="/patient">Patient</router-link>
        <router-link class="ml-5" to="/auth">Auth</router-link>
        <router-link class="ml-5" to="/doctor">Doctor</router-link>
        <router-link class="ml-5" to="/laboratorian">Laboratorian</router-link>
        <router-link class="ml-5" to="/pharmacist">Pharma</router-link>
        <router-link class="ml-5" to="/admin">Admin</router-link>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import SideBar from '@/components/SideBar'
export default {
  name: 'App',

  components: {
    SideBar
  },

  data: () => ({
    items: [
      { title: 'Home', icon: 'fas fa-home', route: '/patient'},
      { title: 'Past Appointments', icon: 'fas fa-history', route: '/patient/past-appointments'},
      { title: 'Appointments', icon: 'far fa-calendar-alt', route: '/patient/appointments'},
      { title: 'Tests', icon: 'fas fa-flask', route: '/patient/tests'},
      { title: 'Prescriptions', icon: 'fas fa-file-medical', route: '/patient/prescriptions'}
    ],
    itemsDoctor: [
      { title: 'Home', icon: 'fas fa-home', route: '/doctor'},
      { title: 'Past Appointments', icon: 'far fa-calendar-alt', route: '/doctor/appointments'},
      { title: 'Calendar', icon: 'mdi-calendar-edit', route: '/doctor/plans'},
    ],
    laboratorianList: [
      { title: 'Home', icon: 'fas fa-home', route: '/laboratorian'},
      { title: 'Preparing Tests', icon: 'mdi-flask-plus-outline', route: '/laboratorian/prep-tests'},
      { title: 'Finalised Tests', icon: 'fas fa-flask', route: '/laboratorian/done-tests'},
    ],
    pharmacistList: [
      { title: 'Home', icon: 'fas fa-home', route: '/pharmacist'},
      { title: 'Filled Prescriptions', icon: 'mdi-pill', route: '/pharmacist/prescriptions'},
      { title: 'Inventory', icon: 'mdi-truck-outline', route: '/pharmacist/inventory'},
    ],
    adminList: [
      { title: 'Add Staff', icon: 'fas fa-home', route: '/admin'},
      { title: 'Add Tests', icon: 'fas fa-flask', route: '/admin/tests'},
      { title: 'Add Components', icon: 'mdi-flask-plus-outline', route: '/admin/components'},
      { title: 'Add Diseases', icon: 'fas fa-disease', route: '/admin/diseases'},
      { title: 'Add Symptoms', icon: 'far fa-flushed', route: '/admin/symptoms'},
      { title: 'Add Medicince', icon: 'mdi-pill', route: '/admin/medicine'},
    ]
  }),
};
</script>

<style scoped>

</style>