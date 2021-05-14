<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-col>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Appointments</h1>
        </v-col>
        <v-col class="d-flex justify-end mt-16 pt-5">
          <v-dialog
            v-model="dialog"
            persistent
            max-width="30vw"
          >
            <v-card>
              <v-card-title class="headline datatablefontcolor--text text-center">
                New Appointment
              </v-card-title>
              <v-card-text class="mt-4">
                <!-- maybe use cached items prop -->
                <v-form ref="form" v-model="valid">
                <v-select
                  v-model="appointment.department"
                  autofocus
                  clearable
                  :rules="[v => !!v || 'Department is required']"
                  prepend-inner-icon="mdi-domain"
                  :items="selects"
                  label="Department"
                  outlined
                ></v-select>
                <v-select
                  v-model="appointment.doctor"
                  :disabled="(!!appointment.department) ? false: true"
                  clearable
                  :rules="[v => !!v || 'Doctor is required']"
                  prepend-inner-icon="mdi-doctor"
                  :items="doctors"
                  item-text="name"
                  return-object
                  label="Doctor"
                  outlined
                ></v-select>
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  :return-value.sync="appointment.date"
                  persistent
                  width="25vw"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      outlined
                      v-model="appointment.date"
                      :disabled="(!!appointment.department && !!appointment.doctor) ? false: true"
                      :rules="[v => !!v || 'Appointment Date is required']"
                      label="Appointment Date"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="appointment.date"
                    :allowed-dates="noDateArray"
                    scrollable
                    :min="toIsoString(new Date()).substring(0, 10)"
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
                      @click="$refs.dialog.save(appointment.date)"
                    >
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="datatablefontcolor"
                  text
                  @click="dialog=false"
                >
                  Cancel
                </v-btn>
                <v-btn
                  color="datatablefontcolor"
                  text
                  @click="validateForm"
                >
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn @click.stop="resetValidation" outlined color="#5080DE" class="mr-5 font-weight-bold"><v-icon left>mdi-calendar-plus</v-icon>New Appointment</v-btn>
        </v-col>
      </v-row>
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
            <v-col class="d-flex justify-center mx-n6">
                <v-btn icon @click="editApt(item)" color="datatablefontcolor"><v-icon>mdi-pencil-outline</v-icon></v-btn>
            </v-col>
            <v-col v-if="item.status === 'upcoming'" class="d-flex justify-center ml-n8">
                <v-btn icon @click="deleteApt(item)" color="datatablefontcolor"><v-icon>mdi-delete</v-icon></v-btn>
            </v-col>
            </v-row>
          </template>
      </PaginationTable>
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
// TODO - Datepicker should not disable dates but rather doctor choice should vary based on the date
<script>
import PaginationTable from "@/components/PaginationTable";
export default {
  components: {
    PaginationTable
  },

  data: () => ({
    snackbar: false,
    overlay: false,
    errorMsg: '',
    edit:false,
    id:'',
    dateArray: [],
    modal:false,
    valid: false,
    appointment:{
      id: '',
      department: '',
      date: '',
      doctor: ''
    },
    dialog:false,
    buttonHeader: 'details',
    selects:[],
    doctors:[],
    headers: [
    {
        text: 'Appointment ID',
        align: 'start',
        // sortable: false,
        // filterable: false,
        value: 'id',
        class: 'datatablefontcolor--text'
    },
    { text: 'Doctor Name', value: 'doctor', class: 'datatablefontcolor--text' },
    { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
    { text: 'Department', value: 'department', class: 'datatablefontcolor--text' },
      { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
    { text: 'Details', value: 'details', sortable:false, class: 'datatablefontcolor--text' },
    ],
    items: [],
    tableInfo: {
        tableTitle: 'Appointments',
        itemsKey: 'id',
        itemsPerPage: 6,
    },
  }),
  methods: {
    noDateArray: function(val){
      return (!this.dateArray.includes(val))
    },
    async getItems(){
      this.overlay = true
      if(this.$cookies.get('user'))
      {
        this.id = this.$cookies.get('user').national_id
        let temp = this.$cookies.get('user').name
        this.patientName = temp.charAt(0).toUpperCase() + temp.slice(1)
      }
      await this.$http.get(this.$url+`/patient/${this.id}/appointments`).then(res => {
        console.log(res)
        this.items = []
        res.data.forEach(x => {
          let temp = {
            id: x.appointment_id,
            doctor: 'Dr. ' + this.capitalise(x.name, x.surname),
            date: x.date,
            department: x.department,
            status: x.status,
          }
          this.items.push(temp)
        })
        this.overlay = false
      }).catch((err) => {
        console.log(err)
        this.errorMsg = 'Unexpected Error, could not load data'
        this.overlay = false
        this.snackbar = true
      })
    },
    async validateForm(){
      this.$refs.form.validate()
      if (this.valid) {
        this.dialog = false
        this.overlay = true
        await this.$http.post(this.$url + `/patient/${this.id}/appointment/newappointment`, {
          date: this.appointment.date,
          doctor_id: this.appointment.doctor.id
        }).then(() => {
          // console.log(res)
          this.$http.post(this.$url + `/doctor/${this.appointment.doctor.id}/create_off_days`, {
            date: this.appointment.date
          }).then(() => {
            // console.log(res)
            this.errorMsg = 'Appointment Created'
            this.overlay = false
            this.snackbar = true
            this.getItems()
          }).catch(err => {
            console.log(err)
            this.errorMsg = 'Unexpected Error in creating Appointment, try again later'
            this.overlay = false
            this.snackbar = true
          })
        }).catch(err => {
          console.log(err.response)
          this.errorMsg = 'Unexpected Error in disbaling date for others'
          this.overlay = false
          this.snackbar = true
        })
        this.appointment.department = ''
        this.appointment.date = ''
        this.appointment.doctor = ''
      }
    },
    editApt: async function(item) {
      this.overlay = true
      this.resetValidation()
      this.edit = true;
      this.appointment.id = item.id
      this.appointment.department = item.department
      // console.log(this.appointment.department)
      this.appointment.date = item.date
      await this.getDocs(item.department)
      // console.log(this.appointment.department)
      let temp = this.doctors.filter(x => x.name === item.doctor)
      this.appointment.doctor = temp[0]
      // console.log(this.appointment.department)
      this.overlay = false
      this.dialog = true
    },
    async deleteApt(item) {
      this.overlay = true
      await this.$http.post(this.$url + `/patient/${item.id}/appointment/cancel`).then(res => {
        console.log(res)
        this.errorMsg = 'Appointment ' + res.data.message +'.'
        this.snackbar = true
        this.getItems()
        this.overlay = false
      }).catch((err) => {
        console.log(err)
        this.errorMsg = 'Unexpected Error, could not load data'
        this.overlay = false
        this.snackbar = true
      })
    },
    async resetValidation () {
      this.overlay = true
      if(this.$refs.form) {
        this.$refs.form.resetValidation()
      }
      if(this.selects.length === 0)
      {
        await this.$http.get(this.$url+`/patient/${this.id}/appointment/newappointment/departments`).then(res => {
          res.data.forEach(x => {
            this.selects.push(x.name)
          })
          this.overlay = false
        }).catch((err) => {
          console.log(err)
          this.errorMsg = 'Unexpected Error, try again later'
          this.overlay = false
          this.snackbar = true
        })
      }
      this.overlay = false
      this.dialog=true;
    },
    getDocs: async function(val){
      if (val) {
        await this.$http.get(this.$url+`/patient/${this.id}/appointment/newappointment/doctor`, {
          params: {
            department: val
          }
        }).then(res => {
          this.doctors = []
          res.data.forEach(x => {
            this.doctors.push({
              id: x.national_id,
              name: 'Dr. ' + this.capitalise(x.name, x.surname)
            })
          })
          // return new Promise(resolve => {resolve('resolved')});
        }).catch(err => {
          console.log(err)
          this.errorMsg = 'Error retrieving list of Doctors'
          this.dialog = false
          this.snackbar = true
        })
      }
    },
  },
  created: function(){
    // this.appointment.date = this.toIsoString(new Date()).substring(0, 10)
    // console.log(this.appointment.date)
  },
  mounted() {
    this.getItems()
  },
  watch: {
    "appointment.department": async function(val){
      this.getDocs(val)
    },
    "appointment.doctor": async function(val){
      if (val) {
        // TODO - remove substring once all dates are made string in db
        await this.$http.get(this.$url+`/doctor/${val.id}/off_days`).then(res => {
          // console.log(res)
          this.dateArray = []
          res.data.forEach(x => {
            this.dateArray.push(x.date.substring(0,10))
          })
        }).catch(err => {
          console.log(err)
          this.errorMsg = 'Error retrieving doctor\'s days off'
          this.dialog = false
          this.snackbar = true
        })
      }
    }
  }
};
</script>

<style scoped>

</style>