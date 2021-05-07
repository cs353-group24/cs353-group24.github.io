<template>
  <v-app>
    <v-main class="mt-n2">
      <v-container class="pt-4 px-auto mx-auto">
          <v-row>
              <v-dialog
                persistent
                v-model="dialog"
                max-width="290"
                >
                <v-card>
                    <v-card-title class="headline">
                    Leave Page?
                    </v-card-title>

                    <v-card-text>
                    Signup will not be completed if you leave this page!
                    </v-card-text>

                    <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="red darken-1"                     
                        text
                        @click="$router.push({name:'Login'})"
                    >
                        Leave
                    </v-btn>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="dialog = false"
                    >
                        Stay
                    </v-btn>
                    </v-card-actions>
                </v-card>
                </v-dialog>
          </v-row>
        <v-row>
          <v-col cols="12" md="4">
            <v-card flat>
              <v-card-title class="v-card-title mt-16 mb-1">
                Getting to Know You!
              </v-card-title>
            </v-card>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="5">
            <v-card outlined class="py-16 px-8 rounded-xl mt-n5" height="110%" width="90%" :elevation="8">
              <v-form ref="form" v-model="valid">
                <v-card flat class="align-center d-flex flex-row justify-center">
                  <v-card-title class="blue--text text--darken-3 text-h4 font-weight-black mb-3 mt-n5">
                    Sign Up
                  </v-card-title>
                </v-card>
                <v-container>
                    <v-row class="mt-n4">
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
                  <v-row class="mt-n7">
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
                      <v-btn outlined color="#5080DE" width="100%" large class="rounded-lg font-weight-bold" @click="goToLogin" >
                        <v-icon left>
                            mdi-keyboard-backspace
                        </v-icon>
                          Login</v-btn>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-btn @click="signupNext" width="100%" height="100%" color="#558EFE" class="white--text rounded-lg font-weight-bold">Next</v-btn>
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
      dialog: false,
      email: '',
      id: '',
      password: '',
      idRules: [
        v => !!v || 'National ID is required'
      ],
      passRules: [
        v => !!v || 'Password is required',
        v => v.length >= 8 || 'Password should be at least 8 characters'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      value: String,
    }),
    methods: {
      goToLogin() {
        this.$refs.form.validate();
        if(!this.valid){
            this.$router.push({name:'Login'});
        }
        else{
            this.dialog = true;
        }
      },
      signupNext(){
          this.$refs.form.validate();
          if (this.valid) {
              this.$router.push({name:'Signup2'});
          }
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
    line-height: 4.5rem;
  }
</style>