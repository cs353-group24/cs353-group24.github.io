<template>
  <nav>
    <v-navigation-drawer v-model="drawer" dark app permanent >
      <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon  >fas fa-user-alt</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list rounded>
        <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="$router.push({ path: item.route })"
            link
        >
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="nav-title">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list style="position: absolute; bottom: 0" class="ml-3" flat>
        <v-list-item router to="/">
          <v-list-item-action>
            <v-icon right>fas fa-sign-out-alt</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  name: "SideBar",
  data: () =>({
    drawer: true,
    items: [
      { title: 'Home', icon: 'fas fa-home', route: '/'},
      { title: 'New Appointment', icon: 'far fa-calendar-plus', route: '/about'},
      { title: 'Past Appointments', icon: 'fas fa-history', route: '/about'},
      { title: 'Appointments', icon: 'far fa-calendar-alt', route: '/about'},
      { title: 'Tests', icon: 'fas fa-flask', route: '/about'},
      { title: 'Prescriptions', icon: 'fas fa-file-medical', route: '/about'}
    ]
  })
}
</script>

<style scoped>
.nav-title{
  text-align: left;
}
</style>