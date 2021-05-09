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
                      :disabled="!!appointment.department ? false: true"
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
                <v-select
                  v-model="appointment.doctor"
                  :disabled="(!!appointment.department && !!appointment.date) ? false: true"
                  clearable
                  :rules="[v => !!v || 'Doctor is required']"
                  prepend-inner-icon="mdi-doctor"
                  :items="doctors"
                  label="Doctor"
                  outlined
                ></v-select>
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
            <v-col class="d-flex justify-center mx-n5">
                <v-btn @click="editApt(item)" width="70%" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Edit</v-btn>
            </v-col>
            <v-col class="d-flex justify-center ml-n8">
                <v-btn @click="deleteApt(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Cancel</v-btn>
            </v-col>
            </v-row>
          </template>
      </PaginationTable>
    </v-container>
  </v-app>
</template>

<script>
import PaginationTable from "@/components/PaginationTable";
export default {
  components: {
    PaginationTable
  },

  data: () => ({
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
    selects:['Cardilogy', 'Radiology', 'Urology', 'Plastic Surgery'],
    doctors:['Mohi', 'Sunny', 'Arnisa', 'Atakan'],
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
    validateForm(){
      this.$refs.form.validate()
      if (this.valid) {
        if(this.edit === true)
        {
          this.deleteApt(this.appointment)
        }
        else{
          this.appointment.id = this.id;
          console.log(this.id)
          this.id++;
        }
        const temp = JSON.parse(JSON.stringify(this.appointment));
        this.items.push(temp);
        this.dateArray.push(temp.date);
        const parsed = JSON.stringify(this.items);
        localStorage.setItem('items', parsed);
        const parsedArray = JSON.stringify(this.dateArray);
        localStorage.setItem('dataArray', parsedArray);
        localStorage.setItem('id', this.id);
        this.appointment.id = ''
        this.appointment.department = ''
        this.appointment.date = ''
        this.appointment.doctor = ''
        this.dialog = false
      }
    },
    editApt: function(item) {
      console.log(this.edit)
      this.edit = true;
      this.appointment.id = item.id
      this.appointment.department = item.department
      this.appointment.date = item.date
      this.appointment.doctor = item.doctor
      this.dialog = true
    },
    deleteApt: function(item) {
      let index = this.items.findIndex(x => x.id === item.id)
      this.items.splice(index, 1);
      index = this.dateArray.findIndex(x => x === item.date)
      this.dateArray.splice(index, 1);
      const parsed = JSON.stringify(this.items);
      localStorage.setItem('items', parsed);
      const parsedArray = JSON.stringify(this.dateArray);
      localStorage.setItem('dataArray', parsedArray);
    },
    resetValidation () {
      console.log('valid')
      this.edit = false;
      this.dialog=true;
      this.$refs.form.resetValidation()
    }
  },
  created: function(){
    // this.appointment.date = this.toIsoString(new Date()).substring(0, 10)
    // console.log(this.appointment.date)
  },
  mounted() {
    if (localStorage.getItem('items')) {
      try {
        this.items = JSON.parse(localStorage.getItem('items'));
      } catch(e) {
        localStorage.removeItem('items');
      }
    }
    if (localStorage.getItem('dataArray')) {
      try {
        this.dateArray = JSON.parse(localStorage.getItem('dataArray'));
      } catch(e) {
        localStorage.removeItem('dataArray');
      }
    }
    if (localStorage.getItem('id')) {
      try {
        this.id = localStorage.getItem('id');
      } catch(e) {
        localStorage.removeItem('id');
      }
    }
    else{
      this.id = 1
    }
  },
};
</script>

<style scoped>

</style>