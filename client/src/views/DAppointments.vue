<template>
  <v-app>
    <v-container class="">
      <v-row>
        <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Past Appointments</h1>
      </v-row>
      <PaginationTable :items="items" :headers="headers" :tableInfo="doctortableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
            <v-col class="d-flex justify-center mx-n5">
                <v-col class="d-flex justify-center mx-n7">
                    <v-btn @click="getDetails(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">View Details</v-btn>
                </v-col>
            </v-col>
            </v-row>
          </template>
      </PaginationTable>
      <AppointmentDetails :appointment="appointment" :tableInfo="tableInfo" :model="dialog" :diag="diagDesc"
            @symptomAdd="symptomAdd"
            @viewResult="viewResult($event)"
            @testAdd="addTest"
            @validateForm="validateForm"
            @diagnosis="diagnosis"
            @close="dialog=false"
            @overlay="overlay=!overlay"
            @snackbar="snackbar=!snackbar"
            @err="errorMsg=$event"
        >
        </AppointmentDetails>
        <Dialog :tableData="group" :dialog="dialog1" :title="!!item? `Result: ${item.resultID} - ${item.name}`: ` `" @close="dialog1=false;dialog=true"></Dialog>
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
import AppointmentDetails from "@/components/AppointmentDetails"
import PaginationTable from "@/components/PaginationTable";
import Dialog from "@/components/Dialog"
export default {
  data: () => ({
    item: null,
      dialog1:false,
      group: {
        items:[],
        headers: [
        { text: 'Component Name', value: 'name', class: 'datatablefontcolor--text' },
        { text: 'Lower-Normality-Interval', value: 'l_interval', class: 'datatablefontcolor--text' },
        { text: 'Upper-Normality-Interval', value: 'u_interval', class: 'datatablefontcolor--text' },
        { text: 'Value', value: 'value', class: 'datatablefontcolor--text' },
        { text: 'Result', value: 'result', class: 'datatablefontcolor--text' },
        { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
        ],
        tableInfo:{
            tableTitle: 'Test Component Results',
            itemsKey: 'name',
            itemsPerPage: 6,
        },
        buttonHeader: 'details'
      },
      appointment: {
        id: '',
        name: '',
        date: '',
        status: ''
      },
      snackbar: false,
      overlay: false,
      errorMsg: '',
      id:'',
      dialog: false,
      tableInfo: {
          symptomItems: [],
          presItems: [],
          testItems: [],
          diagItems: []
      },
      doctor: '',
      buttonHeader:'details',
      headers: [
      {
          text: 'Appointment ID',
          align: 'start',
          // sortable: false,
          // filterable: false,
          value: 'id',
          class: 'datatablefontcolor--text'
      },
      { text: 'Patient Name', value: 'patient', class: 'datatablefontcolor--text' },
      { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
      { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
      { text: 'Details', value: 'details', sortable:false, class: 'datatablefontcolor--text' },
      ],
      items:[],
      dateArray:[],
      doctortableInfo: {
          tableTitle: 'Past Appointments',
          itemsKey: 'id',
          itemsPerPage: 6,
      },
      diagDesc: '',
    }),
    components: {
        PaginationTable, AppointmentDetails, Dialog
    },
    methods:{
        async viewResult(item) {
          this.item = item
          this.overlay = true
          await this.$http.get(this.$url + `/doctor/${this.id}/${this.appointment.id}/see_test_components`, {
            params: {
              result_id: item.resultID
            }
          }).then(res=>{
            console.log(res)
            this.group.items=[]
            res.data.forEach(x=>{
              this.group.items.push({
                name: x.comp_name,
                status: x.comp_status,
                result: (x.comp_result === null? '-': x.comp_result),
                value: x.comp_value,
                u_interval: x.upper_normality_interval,
                l_interval: x.lower_normality_interval,
              })
            })
            this.dialog1 =true
            this.dialog = false
          }).catch(err=>{
            console.log(err)
            this.errorMsg = 'Unexpected Error, could not load data'
            this.overlay = false
            this.snackbar = true
          }).finally(()=>{
            this.overlay=false
          })
        },
        async getItemsData(){
          this.overlay = true
          await this.$http.get(this.$url+`/doctor/${this.id}/homepage`).then(res => {
            console.log(res)
            this.items = []
            res.data.forEach(x => {
                console.log(res)
              if (x.status === 'finalized') {
                let temp = {
                  id: x.appointment_id,
                  patient: this.capitalise(x.name, x.surname),
                  date: x.date,
                  status: x.status
                }
                this.items.push(temp)
              }
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
            this.overlay = true
            await this.$http.get(this.$url+`/doctor/${this.id}/get_presc_medicine`,{
              params:{
                prescription_no: this.appointment.id
              }
            }).then(res => {
              this.tableInfo.presItems=[]
              console.log(res)
              res.data.forEach(x => {
                this.tableInfo.presItems.push({
                  name: x.med_name,
                  man: x.manufacturer,
                  date: this.appointment.date,
                  qty: x.qty,
                  usg: x.usage_method
                })
              })
            }).catch(err => {
              console.log(err)
              this.errorMsg = 'Unexpected Error, could not load data'
              this.snackbar = true
            }).finally(()=>{
              this.overlay = false
            })
        },
        async addTest() {
          this.overlay = true
            await this.$http.get(this.$url+`/doctor/${this.id}/${this.appointment.id}/see_tests`).then(res => {
              console.log(res)
              this.tableInfo.testItems=[]
              res.data.forEach(x => {
                this.tableInfo.testItems.push({
                  name: x.test_name,
                  date: x.date_to_char,
                  lab: this.capitalise(x.name, x.surname),
                  status: x.test_status,
                  resultID: x.result_id
                })
              })
            }).catch(err => {
              console.log(err.response)
              this.errorMsg = 'Unexpected Error, could not load data'
              this.snackbar = true
            }).finally(()=>{
              this.overlay = false
            })
        },
        async symptomAdd(){
            this.overlay = true
            await this.$http.get(this.$url+`/doctor/${this.id}/${this.appointment.id}/see_patient_symptoms`).then(res => {
              // console.log(res)
              this.tableInfo.symptomItems=[]
              res.data.forEach(x => {
                this.tableInfo.symptomItems.push({
                  name: x.symptom_name,
                  details: x.description
                })
              })
            }).catch(err => {
              console.log(err.response)
              this.errorMsg = 'Unexpected Error, could not load data'
              this.snackbar = true
            }).finally(()=>{
              this.overlay = false
            })
            
        },
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        async getDiag(){
            this.overlay = true
            await this.$http.get(this.$url + `/doctor/${this.id}/${this.appointment.id}/see_diagnosis`).then(res => {
                console.log(res)
                this.tableInfo.diagItems= []
                res.data.forEach(x => {
                    this.tableInfo.diagItems.push({
                        name: x.disease_name,
                        desc: x.description
                    })
                })
            }).catch(err => {
                console.log(err.response)
                this.errorMsg = 'Unexpected Error, could not load data'
                this.snackbar = true
            }).finally(() => {
            })
            await this.$http.get(this.$url + `/doctor/${this.id}/${this.appointment.id}/see_diagnosis_desc`).then(res => {
                // console.log(res)
                this.diagDesc = res.data[0].description
            }).catch(err => {
                console.log(err.response)
                this.errorMsg = 'Unexpected Error, could not load data'
                this.snackbar = true
            }).finally(() => {
                this.overlay = false
            })
        },
        async getDetails(item){
          this.overlay = true
          this.appointment.id = item.id
          this.appointment.name= item.patient
          this.appointment.date= item.date
          this.appointment.status= item.status
          this.tableInfo.symptomItems = [];
          this.tableInfo.testItems = [];
          this.tableInfo.presItems = [];
          
          this.symptomAdd()
          this.addTest()
          this.checkPres()
          this.validateForm()
          this.getDiag()
          this.dialog=true
        },
        async diagnosis(){
          this.overlay = true
          await this.$http.post(this.$url + `/patient/${this.id}/appointment/status`, {
            appointment_id: this.appointment.id
          }).then(res => {
            console.log(res)
            this.errorMsg = 'Appointment is finalized now'
          }).catch(err => {
            console.log(err)
            this.errorMsg = 'Unexpected Error, could not load data'
          }).finally(() => {
            this.snackbar = true
            this.overlay = false
          })
          this.getItemsData()
        },
        async checkPres(){
            this.overlay = true
            await this.$http.get(this.$url+`/doctor/${this.id}/get_prescription`, {
                params: {
                    appointment_id: this.appointment.id
                }
            }).then(res=>{
                console.log(res)
                if(res.data.length === 0){
                  this.$http.post(this.$url+`/doctor/${this.id}/add_prescription`, {
                    appointment_id: this.appointment.id
                  }).then(res => {
                    console.log(res)
                  }).catch(err => {
                    console.log(err.response)
                  })
                }
            }).catch(err=>{
                console.log(err)
            })
            this.overlay = false
        }
    },
    mounted() {
      this.id = this.$cookies.get('user').national_id
      let temp = this.$cookies.get('user').name
      let temp1 = this.$cookies.get('user').surname
      this.doctor = this.capitalise(temp, temp1)
      this.getItemsData()
    },
};
</script>

<style scoped>

</style>