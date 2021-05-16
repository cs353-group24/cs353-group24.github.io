<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-row>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Add Department</h1>
        </v-row>
      </v-row>
      <v-row>
        <v-card class="elevation-0 mt-5 ml-5" color="datatablecolor" width="100%">
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-row class="mt-5">
                <v-col>
                  <v-text-field
                    outlined
                    v-model="depName"
                    clearable
                    :prepend-inner-icon="'mdi-domain'"
                    :rules="[v => !!v || 'Department Name is required']"
                    label="Department Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="est"
                    persistent
                    width="25vw"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        outlined
                        v-model="est"
                        :rules="[v => !!v || 'Date of Establishment is Required']"
                        label="Date Established"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      class="pt-10"
                      :max="toIsoString(new Date).substr(0, 10)"
                      v-model="est"
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
                        @click="$refs.dialog.save(est)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                  <v-col>
                      <v-text-field
                        outlined
                        v-model="building"
                        clearable
                        :rules="[v => !!v || 'Department Building is required']"
                        label="Department Building"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col>
                      
                  </v-col>
              </v-row>
              <v-row  class="d-flex justify-end">
                <v-btn width="15%" large color="#558EFE" class="white--text rounded-lg font-weight-bold mr-5 mb-5" @click="addDep">
                    Add
                  </v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
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
  </v-app>
</template>

<script>
export default {
  data: ()=>({
    building:'',
    errorMsg: '',
    overlay:false,
    snackbar:false,
    valid: false,
    est:'',
    modal:false,
    depName:'',
  }),
  methods: {
    async addDep(){
      this.$refs.form.validate()
      if (this.valid) {
        this.overlay = true
        await this.$http.post(this.$url + `/admin/add_department`, {
            name: this.depName,
            date_est: this.est,
            building: this.building
        }).then(res => {
            console.log(res)
            this.errorMsg = `${this.name} has been added to departments`
        }).catch(err => {
            console.log(err)
            this.errorMsg = `Unknown error, try again later`
        }).finally(()=>{
            this.overlay = false
            this.snackbar = true
            this.depName = ''
            this.est = ''
            this.building = ''
            this.$refs.form.resetValidation()
        })
      }
    }
  }
}
</script>

<style>

</style>