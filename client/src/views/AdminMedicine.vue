<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-row>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Add Medicine</h1>
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
                      v-model="medicineName"
                      clearable
                      :prepend-inner-icon="'fas fa-disease'"
                      :rules="[v => !!v || 'Medicine name is required']"
                      label="Medicine Name"
                      required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                      outlined
                      v-model="manufacturer"
                      clearable
                      :prepend-inner-icon="'fas fa-industry'"
                      :rules="[v => !!v || 'Manufacturer name is required']"
                      label="Manufacturer"
                      required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                <v-col>
                  <v-text-field
                      outlined
                      v-model="stock"
                      label="Stock"
                      clearable
                      rows="4"
                      :rules="[v => !!v || 'Provide stock number']"
                      requred
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex justify-end">
                  <v-btn width="15%" large color="#558EFE" class="white--text rounded-lg font-weight-bold mr-5 mb-5" @click="addMedicine">
                    Add
                  </v-btn>
                </v-col>
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
  data:()=>({
    snackbar: false,
    overlay: false,
    errorMsg: '',
    medicineName: '',
    manufacturer: '',
    stock: '',
    valid: false,
  }),
  methods:{
    async addMedicine(){
      this.$refs.form.validate()
      if (this.valid) {
        this.overlay = true
        await this.$http.post(this.$url+`/admin/add_medicine`, {
          name: this.medicineName,
          manufacturer: this.manufacturer,
          stock: this.stock
        }).then( () => {
          this.errorMsg = 'Medicine added.'
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
        this.medicineName = ''
        this.manufacturer = ''
        this.stock = ''
        this.$refs.form.resetValidation()
      }
    }
  }
}
</script>

<style>

</style>