<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-row>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Add Test Components</h1>
        </v-row>
      </v-row>
      <v-row>
        <v-card class="elevation-0 mt-5 ml-5" color="datatablecolor" width="100%">
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-row class="mt-5">
                <v-col>
                  <v-autocomplete
                      v-model="testName"
                      clearable
                      :rules="[v => !!v || 'Test name is required']"
                      prepend-inner-icon="fas fa-flask"
                      :items="tests"
                      label="Test Name"
                      outlined
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    v-model="compName"
                    clearable
                    :prepend-inner-icon="'mdi-flask-plus-outline'"
                    :rules="[v => !!v || 'Component Name is required']"
                    label="Component Name"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                  <v-col>
                      <v-text-field
                        outlined
                        v-model="l_interval"
                        clearable
                        :rules="[v => (/^\d+$/.test(v) || !!!v) || 'Numbers only']"
                        label="Lower Normality Interval"
                        required
                    ></v-text-field>
                  </v-col>
                  <v-col>
                      <v-text-field
                        outlined
                        v-model="u_interval"
                        clearable
                        :rules="[v => (/^\d+$/.test(v) || !!!v) || 'Numbers only']"
                        label="Upper Normality Interval"
                        required
                    ></v-text-field>
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
    testName: '',
    compName: '',
    l_interval: '',
    u_interval: '',
    tests: [],
  }),
  methods: {
    async addTest(){
      this.$refs.form.validate()
      if (this.valid) {
        this.overlay = true
        await this.$http.post(this.$url+`/admin/add_component`, {
          test_name: this.testName,
          comp_name: this.compName,
          lower_normality_interval: Number(this.l_interval),
          upper_normality_interval: Number(this.u_interval)
        }).then( () => {
          this.errorMsg = 'Component added.'
          this.overlay = false
          this.snackbar = true
          this.testName = ''
          this.compName = ''
          this.u_interval = ''
          this.l_interval = ''
          this.$refs.form.resetValidation()
        }).catch((err) => {
          console.log(err)
          this.errorMsg = 'Unexpected Error, could not load data'
          this.overlay = false
          this.snackbar = true
        })
      }
    },
    async loadTestTypes(){
      this.overlay = true
      await this.$http.get(this.$url+`/doctor/1/get_test_types`).then(res => {
        res.data.forEach(x => {
          this.tests.push(x.test_name)
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
    this.loadTestTypes();
  }
}
</script>

<style>

</style>