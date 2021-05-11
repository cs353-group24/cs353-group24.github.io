<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-row>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Add test</h1>
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
                  :rules="[v => !!v || 'Test Name is required']"
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
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: ()=>({
    valid: false,
    testName: '',
    compName: '',
    l_interval: '',
    u_interval: '',
    tests: ['Blood', 'Kidney', 'Liver', 'Brain'],
  }),
  methods: {
    addTest(){
      this.$refs.form.validate()
      if (this.valid) {
        let temp = {testname: this.testName, compname: this.compName, l_interval: this.l_interval? Number(this.l_interval) : '-',
        u_interval: this.u_interval? Number(this.u_interval) : '-'}
        console.log(temp)
        this.testName = ''
        this.compName = ''
        this.u_interval = ''
        this.l_interval = ''
        this.$refs.form.resetValidation()
      }
    }
  }
}
</script>

<style>

</style>