<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-row>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Add Symptoms</h1>
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
                    v-model="sName"
                    clearable
                    :prepend-inner-icon="'fas fa-flushed'"
                    :rules="[v => !!v || 'Symptom Name is required']"
                    label="Symptom Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-textarea
                    outlined
                    v-model="sDesc"
                    clearable
                    :rules="[v => !!v || 'Symptom Description is required']"
                    label="Symptom Description"
                    required
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row  class="d-flex justify-end">
                <v-btn width="15%" large color="#558EFE" class="white--text rounded-lg font-weight-bold mr-5 mb-5" @click="addSymptom">
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
    errorMsg: '',
    overlay:false,
    snackbar:false,
    valid: false,
    sDesc: '',
    sName: '',
  }),
  methods: {
    async addSymptom(){
      this.$refs.form.validate()
      if (this.valid) {
        this.overlay = true
        await this.$http.post(this.$url + `/admin/add_symptom`, {
          name: this.sName,
          description: this.sDesc
        }).then(res => {
          console.log(res)
          this.errorMsg = `${this.sName} has been added to diseases`
        }).catch(err => {
          console.log(err)
          this.errorMsg = "Unknown Error, try again later"
        }).finally(() => {
          this.overlay = false
          this.snackbar = true
          this.sDesc = ''
          this.sName = ''
          this.$refs.form.resetValidation()
        })
      }
    }
  }
}
</script>

<style>

</style>