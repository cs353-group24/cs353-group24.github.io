<template>
  <v-app>
    <v-main class="">
      <v-app-bar flat color="F7FAFB" class="mb-16">
        <v-app-bar-title>Hospital Database Management System</v-app-bar-title>
        <v-spacer></v-spacer>
        <router-link to="/test">Test</router-link>
        <router-link class="ml-5" to="/patient">Patient</router-link>
      </v-app-bar>
      <v-container class="pt-4 px-auto mx-auto">
        <v-row>
          <v-col cols="12" md="5">
            <v-card flat>
              <v-card-title class="v-card-title mt-16 mb-1">
                Welcome to our DBMS
              </v-card-title>
              <v-card-subtitle class="blue--text text--darken-2">
                The best among all others
              </v-card-subtitle>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="5">
            <v-card outlined class="py-16 px-8 rounded-xl mt-n5" height="110%" width="90%" :elevation="8">
              <v-form v-model="valid">
                <v-card flat class="align-center d-flex flex-row justify-center">
                  <v-card-title class="blue--text text--darken-3 text-h4 font-weight-black mb-3">
                    Login
                  </v-card-title>
                </v-card>
                <v-container>
                  <v-row class="mt-4">
                    <!-- <v-col class="col-auto d-flex flex-column justify-center">
                      <v-icon color="#558EFE" class="">mdi-email</v-icon>
                    </v-col> -->
                    <v-col>
                      <v-text-field
                        outlined
                        v-model="email"
                        clearable
                        :prepend-inner-icon="'mdi-email'"
                        :rules="emailRules"
                        label="Email"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row class="mt-n7">
                    <!-- <v-col class="col-auto d-flex flex-column justify-center">
                      <v-icon color="#558EFE" >mdi-form-textbox-password</v-icon>
                    </v-col> -->
                    <v-col>
                      <v-text-field
                        required
                        outlined
                        clearable
                        v-model="password"
                        :rules="passRules"
                        label="Enter password"
                        :prepend-inner-icon="'mdi-form-textbox-password'"
                        :append-icon="value ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                        @click:append="() => (value = !value)"
                        :type="value ? 'password' : 'text'"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-btn width="100%" height="100%" color="#558EFE" class="white--text rounded-lg font-weight-bold">Login</v-btn>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-btn @click="goToSignup" width="100%" large class="rounded-lg font-weight-bold" outlined color="#5080DE">Signup</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      valid: false,
      email: '',
      password: '',
      passRules: [
        v => !!v || 'Password is required'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      value: String,
    }),
    methods: {
      goToSignup() {
        this.$router.push({name:'Signup'});
      }
    }
  }
</script>

<style scoped>
  .v-app-bar .v-app-bar-title {
    font-weight: 1000;
    color: #4874C8;
    margin-left: 3em;
  }
  .v-card-title {
    color:#4874C8;
    font-weight:1000;
    font-size: 4rem;
    line-height: 4rem;
  }
</style>