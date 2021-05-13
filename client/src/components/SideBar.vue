<template>
  <nav>
    <v-navigation-drawer v-model="drawer" app permanent style="background: linear-gradient(175.77deg, #D1E1FF -33.54%, #5080DE 137.45%);">
      <v-list height="8.7%">
        <v-list-item>
          <v-list-item-icon>
            <v-icon  >fas fa-user-alt</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{userName}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list rounded flat nav>
        <v-list-item-group
          v-model="selectedItem"
          color="white"
          mandatory
        >
        <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="$router.push({ path: item.route })"
            link
            class="white--text"
        >
          <v-list-item-icon>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="nav-title">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-list style="position: absolute; bottom: 0" class="ml-3" flat>
        <v-list-item @click="logout">
          <v-list-item-action >
            <v-icon  left class="flip">fas fa-sign-out-alt</v-icon>
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
  userName: '',
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
    selectedItem: '',
  }),
  methods:{
    logout(){
      this.$cookies.remove('user')
      this.$router.push({path: '/'})
    }
  },
  created(){
    this.selectedItem = this.items.findIndex((x) => x.route === this.$router.currentRoute.path)
    if(!this.$cookies.get('user')){
      this.$router.push({path: '/'})
    }
    else{
      let temp = this.$cookies.get('user')
      this.userName = temp.name.charAt(0).toUpperCase() + temp.name.slice(1) + ' ' + temp.surname.charAt(0).toUpperCase() + temp.surname.slice(1)
      // console.log(this.userName)
    }
  },
  watch: {
    $route (){
        this.selectedItem = this.items.findIndex((x) => x.route === this.$router.currentRoute.path)
    }
  }
}
</script>

<style scoped>
.nav-title{
  text-align: left;
}
.flip {
  transform: rotate(360deg) scaleX(-1);
}
</style>