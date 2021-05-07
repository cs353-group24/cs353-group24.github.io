<template>
  <nav>
    <v-navigation-drawer v-model="drawer" app permanent >
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
  //change
  name: "SideBar",
  props:{
    items: {
      type: Array,
      default: function() {
        return [];
      },
    }
  },
  data: () =>({
    drawer: true,
  })
}
</script>

<style scoped>
.nav-title{
  text-align: left;
}
</style>