<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-row>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Add Tests</h1>
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
                    v-model="testName"
                    clearable
                    :prepend-inner-icon="'fas fa-flask'"
                    :rules="[v => !!v || 'Test Name is required']"
                    label="Test Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-autocomplete
                  v-model="department"
                  clearable
                  :rules="[v => !!v || 'Test Department is required']"
                  prepend-inner-icon="mdi-domain"
                  :items="departments"
                  label="Test Depatment"
                  outlined
                ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row  class="d-flex justify-end">
                <v-btn width="15%" large color="#558EFE" class="white--text rounded-lg font-weight-bold mr-5 mb-5" @click="addTest">
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
    snackbar: false,
    overlay: false,
    errorMsg: '',
    valid: false,
    department: '',
    testName: '',
    departments: [],
  }),
  methods: {
    async addTest(){
      this.$refs.form.validate()
      if (this.valid) {
        this.overlay = true
        await this.$http.post(this.$url+`/admin/add_test`, {
          test_name: this.testName,
          department: this.department
        }).then( () => {
          this.errorMsg = 'Test added.'
          this.overlay = false
          this.snackbar = true
          this.testName = ''
          this.testDep = ''
          this.$refs.form.resetValidation()
        }).catch((err) => {
          console.log(err)
          this.errorMsg = 'Unexpected Error, could not load data'
          this.overlay = false
          this.snackbar = true
        })
      }
    },
    async loadDepartments(){
      this.overlay = true
      await this.$http.get(this.$url+`/patient/1/appointment/newappointment/departments`).then(res => {
        res.data.forEach(x => {
          this.departments.push(x.name)
        })
      }).catch((err) => {
        console.log(err)
        this.errorMsg = 'Unexpected Error, try again later'
        this.snackbar = true
      })
        this.overlay = false
    }
  },
  mounted() {
    this.loadDepartments();
  }
}
</script>

<style>

</style>