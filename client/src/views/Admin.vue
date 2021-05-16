<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-row>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Add staff</h1>
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
                    v-model="id"
                    clearable
                    :prepend-inner-icon="'mdi-account-outline'"
                    :rules="[v => !!v || 'National ID is required']"
                    label="National ID"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                  v-model="personType"
                  clearable
                  :rules="[v => !!v || 'Person Type is required']"
                  prepend-inner-icon="mdi-account-question"
                  :items="types"
                  label="Person Type"
                  outlined
                ></v-select>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                <v-col>
                  <v-text-field
                    outlined
                    v-model="email"
                    clearable
                    :prepend-inner-icon="'mdi-email'"
                    :rules="[v => !!v || 'Email is required', v => /.+@.+/.test(v) || 'E-mail must be valid']"
                    label="Email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    required
                    outlined
                    clearable
                    v-model="password"
                    :rules="[v => !!v || 'Password is required', v => v.length >= 8 || 'Password should be at least 8 characters']"
                    label="Password"
                    :prepend-inner-icon="'mdi-form-textbox-password'"
                    :append-icon="value ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                    @click:append="() => (value = !value)"
                    :type="value ? 'password' : 'text'"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                <v-col>
                  <v-text-field
                    outlined
                    v-model="name"
                    clearable
                    :prepend-inner-icon="'mdi-account-outline'"
                    :rules="[v => !!v || 'Name is Required']"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    outlined
                    v-model="surname"
                    clearable
                    :prepend-inner-icon="'mdi-account-outline'"
                    :rules="[v => !!v || 'Surname is Required']"
                    label="Surname"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row class="mt-n5">
                <v-col>
                  <v-text-field
                    required
                    outlined
                    clearable
                    :rules="[v => !!v || 'Phone is required', v => /^\d+$/.test(v) || 'Numbers only']"
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
                        :rules="[v => !!v || 'Date of Birth is Required']"
                        label="Date of Birth"
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
              <v-row class="mt-n5">
                <v-col>
                  <v-text-field
                    required
                    outlined
                    clearable
                    :disabled="personType === 'doctor' ? false:true"
                    :rules="[v => (!!v || personType !== 'Doctor') || 'Room Number is required', v => (/^\d+$/.test(v) || personType !== 'Doctor') || 'Numbers only']"
                    v-model="roomNo"
                    label="Room Number"
                  ></v-text-field>
                </v-col>
                <v-col>
                  <v-select
                      v-model="department"
                      clearable
                      :disabled="personType === 'pharmacist' ? true:false"
                      :rules="[v => !!v || 'Department is required']"
                      :items="departments"
                      label="Department"
                      outlined
                  ></v-select>
                </v-col>
              </v-row>
              <v-row  class="d-flex justify-end">
                <v-btn width="15%" large color="#558EFE" class="white--text rounded-lg font-weight-bold mr-5 mb-5" @click="addStaff">
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
  data:()=>({
    snackbar: false,
    overlay: false,
    errorMsg: '',
    valid: false,
    id:'',
    types: ['doctor', 'pharmacist', 'laboratorian'],
    departments: [],
    personType: '',
    email: '',
    password: '',
    value:true,
    name: '',
    surname: '',
    phone: '',
    department: '',
    modal: '',
    dob: '',
    roomNo: '',
  }),
  methods: {
    async addStaff(){
      this.$refs.form.validate()
      if (this.valid) {
        this.overlay = true
        await this.$http.post(this.$url+`/admin/add_staff`, {
          national_id: this.id,
          person_type: this.personType,
          email: this.email,
          password: this.password,
          name: this.name,
          surname: this.surname,
          phone: this.phone,
          birthday: this.dob,
          room_no: this.personType === 'Doctor' ? this.roomNo : undefined,
          department: this.personType !== 'Pharmacist' ? this.department : undefined
        }).then( () => {
          this.errorMsg = 'Staff added.'
          this.overlay = false
          this.snackbar = true
          this.id = ''
          this.personType = ''
          this.email = ''
          this.password = ''
          this.name = ''
          this.surname = ''
          this.phone = ''
          this.dob = ''
          this.roomNo = ''
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
      await this.$http.get(this.$url+`/patient/1/appointment/newappointment/departments`).then(res => {
        res.data.forEach(x => {
          this.departments.push(x.name)
        })
      }).catch((err) => {
        console.log(err)
        this.errorMsg = 'Unexpected Error, try again later'
        this.overlay = false
        this.snackbar = true
      })
    }
  },
  mounted() {
    this.loadDepartments();
  }
}
</script>

<style>

</style>