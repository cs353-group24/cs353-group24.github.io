<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Welcome {{patientName}}</h1>
          </v-row>
          <v-row>
            <h4 class="ml-6 blue--text text--lighten-3">You have {{items.length}} upcoming appointments</h4>
          </v-row>
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
    patientName: 'Abdul',
    upcoming: 5,
    buttonHeader: 'actions',
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
    ],
    items: [],
    tableInfo: {
        tableTitle: 'Upcoming',
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
          this.appointment.id = this.id;
          console.log(this.id)
          this.id++;
          const temp = JSON.parse(JSON.stringify(this.appointment));
          this.dateArray.push(temp.date);
          this.items.push(temp);
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
    resetValidation () {
      this.dialog=true;
      if(this.$refs.form) {
          this.$refs.form.resetValidation()   
      }
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