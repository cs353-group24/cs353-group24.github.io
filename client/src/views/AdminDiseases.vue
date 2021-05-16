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
                  v-model="testDep"
                  clearable
                  :rules="[v => !!v || 'Test Department is required']"
                  prepend-inner-icon="mdi-domain"
                  :items="deps"
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
    </v-container>
  </v-app>
</template>

<script>
export default {
  data: ()=>({
    valid: false,
    testDep: '',
    testName: '',
    deps: ['Cardilogy', 'Radiology', 'Urology', 'I forgot'],
  }),
  methods: {
    addTest(){
      this.$refs.form.validate()
      if (this.valid) {
        let temp = {name: this.testName, department: this.testDep}
        console.log(temp)
        this.testName = ''
        this.testDep = ''
        this.$refs.form.resetValidation()
      }
    }
  }
}
</script>

<style>

</style>