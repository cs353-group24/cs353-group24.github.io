<template>
  <v-app>
    <v-main class="mt-n2">
      <v-container class="pt-4 px-auto mx-auto">
          <v-row>
              <v-dialog
                persistent
                v-model="dialog"
                max-width="50vw"
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
          <v-col cols="12" md="5">
            <v-card flat>
              <v-card-title class="v-card-title mt-16 mb-1">
                Last Couple of Things...
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
                        v-model="name"
                        clearable
                        :prepend-inner-icon="'mdi-account-outline'"
                        :rules="idRules"
                        label="First Name"
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
                        v-model="surname"
                        clearable
                        :prepend-inner-icon="'mdi-account-outline'"
                        :rules="idRules"
                        label="Last Name"
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
                        :rules="phoneRules"
                        v-model="phone"
                        label="Phone"
                        :prepend-inner-icon="'mdi-phone'"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-dialog
                        ref="dialog"
                        v-model="modal"
                        :return-value.sync="dob"
                        persistent
                        width="25vw"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            outlined
                            v-model="dob"
                            :rules="dobRules"
                            label="DOB"
                            prepend-inner-icon="mdi-calendar"
                            readonly
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          class="pt-10"
                          :max="toIsoString(new Date).substr(0, 10)"
                          v-model="dob"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="modal = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="$refs.dialog.save(dob)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-dialog>
                    </v-col>
                  </v-row>
                  <!-- <v-row class="mt-n7">
                    <v-col class="col-auto d-flex flex-column justify-center">
                      <v-icon color="#558EFE" >mdi-form-textbox-password</v-icon>
                    </v-col>
                    
                  </v-row> -->
                  <v-row>
                    <v-col class="d-flex justify-center">
                      <v-btn outlined color="#5080DE" width="100%" large class="rounded-lg font-weight-bold" @click.stop="dialog = true" >
                        <v-icon left>
                            mdi-keyboard-backspace
                        </v-icon>
                          Login</v-btn>
                    </v-col>
                    <v-col class="d-flex justify-center">
                      <v-btn width="100%" height="100%" color="#558EFE" class="white--text rounded-lg font-weight-bold">Signup</v-btn>
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
      name: '',
      surname: '',
      phone: '',
      dob: '',
      modal: false,
      idRules: [
        v => !!v || 'Name is required'
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      phoneRules: [
        v => !!v || 'Phone is required',
        v => /^\d+$/.test(v) || 'Numbers only'
      ],
      dobRules: [
        v => !!v || 'DOB is required'
      ],
      value: String,
    }),
    methods: {
      
      
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