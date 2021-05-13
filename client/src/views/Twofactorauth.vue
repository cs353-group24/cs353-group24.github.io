<template>
  <v-app>
    <v-main class="mt-6">
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
              <v-form ref="form" v-model="valid">
                <v-card flat class="align-center d-flex flex-row justify-center">
                  <v-card-title class="blue--text text--darken-3 text-h4 font-weight-black mb-3">
                    Authentication
                  </v-card-title>
                </v-card>
                <v-container>
                    <v-row class="d-flex justify-center blue--text text--darken-3 mt-4">
                        <label>Please Enter Your National ID</label>
                    </v-row>
                  <v-row class="mt-4">
                    <!-- <v-col class="col-auto d-flex flex-column justify-center">
                      <v-icon color="#558EFE" class="">mdi-email</v-icon>
                    </v-col> -->
                    <v-col>
                      <v-text-field
                        outlined
                        v-model="id"
                        clearable
                        :prepend-inner-icon="'mdi-account-outline'"
                        :rules="idRules"
                        label="National ID"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-btn @click="handleauth" large width="50%" color="#558EFE" class="white--text rounded-lg font-weight-bold">Login</v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar
          v-model="snackbar"
          :timeout="5000"
        >
          {{ errorMsg }}

          <template v-slot:action="{ attrs }">
            <v-btn
              color="indigo"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
        <v-overlay :value="overlay">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      snackbar: false,
      overlay: false,
      errorMsg: '',
      valid: false,
      id: '',
      auth:'',
      idRules: [
        v => !!v || 'National ID is required'
      ],
    }),
    methods: {
      async handleauth(){
        this.overlay = true
        this.$refs.form.validate()
        if (this.valid) {
          await this.$http.get(this.$url+'/login_second', {
            params: {
              national_id: this.id
            }
          }).then(res => {
            if (res.data.email === this.auth) {
              this.$cookies.set('user', res.data, '0')
              this.$router.push({path: `/${res.data.person_type}`})
            }
            else{
              this.errorMsg = 'National ID is incorrect, try again later'
              this.snackbar = true
              this.overlay = false
            }
          }).catch(() => {
            this.errorMsg = 'There was an unknown error, please try again later'
            this.snackbar = true
            this.overlay = false
          })
        }
      }
    },
    created(){
      if(this.$cookies.get('auth'))
      {
        this.auth = this.$cookies.get('auth')
        console.log(this.auth)
      }
      else{
        this.$router.push({path: '/'})
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