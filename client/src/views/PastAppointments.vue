<template>
  <v-app>
    <v-container class="">
      <v-row>
        <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Past Appointments</h1>
      </v-row>
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
            <v-col class="d-flex justify-center">
                <v-btn @click.stop="handleDialog1(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Symptoms</v-btn>
            </v-col>
            <v-col class="d-flex justify-center ml-n5">
                <v-btn @click.stop="handleDialog2(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Diagnosis</v-btn>
            </v-col>
            <v-col class="d-flex justify-center ml-n4">
                <v-btn @click.stop="handleDialog3(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Prescription</v-btn>
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
      <Dialog :tableData="group" :item="item1" :itemHeader="headers" :dialogMode="'cols'" :dialog="dialog1" :title="'Symptoms'" @close="dialog1=false"></Dialog>
      <Dialog :tableData="group" :item="item2" :itemHeader="headers" :dialogMode="'cols'" :dialog="dialog2" :title="'Diseases Diagnosed'" @close="dialog2=false"></Dialog>
      <Dialog :tableData="group" :item="item3" :itemHeader="headers" :dialogMode="'cols'" :dialog="dialog3" :title="'Medicines Prescribed'" @close="dialog3=false"></Dialog>
    </v-container>
  </v-app>
</template>

<script>
import PaginationTable from "@/components/PaginationTable";
import Dialog from "@/components/Dialog"
export default {
  components: {
    PaginationTable, Dialog
  },

  data: () => ({
    snackbar: false,
    overlay: false,
    errorMsg: '',
    id:'',
    patientName: '',
    item1:{},
    item2:{},
    item3:{},
    group: {
        items:[],
        headers:[],
        tableInfo:{},
        buttonHeader: ''
    },
    dialog1: false,
    dialog2: false,
    dialog3: false,
    buttonHeader: 'details',
    headers: [
    {
        text: 'Appointment ID',
        align: 'start',
        sortable: false,
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
        tableTitle: 'Past Appointments',
        itemsKey: 'name',
        itemsPerPage: 6,
    },
  }),
  methods: {
    async getItems(){
      this.overlay = true
      if(this.$cookies.get('user'))
      {
        this.id = this.$cookies.get('user').national_id
        let temp = this.$cookies.get('user').name
        this.patientName = temp.charAt(0).toUpperCase() + temp.slice(1)
      }
      await this.$http.get(this.$url+`/patient/${this.id}/appointments`).then(res => {
        this.items = []
        res.data.filter(x => (x.status === 'finalized' || x.status === 'waiting-tests')).forEach(x => {
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
      async handleDialog1(item){
      //waiting for backend
          let symptomsItems = [];
          this.item1 = item;
          this.dialog1 = true;
        await this.$http.get(this.$url+`/patient/${this.id}/see_app_symp`, {
          params: {
            appointment_id: item.id
          }
        }).then(res => {
          console.log(res)
          res.data.forEach(x => {
            let temp = {
              name: x.symptom_name,
              description: x.description,
            }
            symptomsItems.push(temp)
          })
          this.overlay = false
        }).catch((err) => {
          console.log(err)
          this.errorMsg = 'Unexpected Error, could not load data'
          this.overlay = false
          this.snackbar = true
        })
          this.group.headers =[
            { text: 'Name', value: 'name', class: 'datatablefontcolor--text' },
            { text: 'Description', value: 'description', class: 'datatablefontcolor--text' },
          ];
        this.group.items = symptomsItems;
        this.group.tableInfo.tableTitle = 'Symptoms'
      },
      async handleDialog2(item){
        let diagnosisItems = [];
        await this.$http.get(this.$url+`/patient/${this.id}/see_app_diag`, {
          params: {
            appointment_id: item.id
          }
        }).then(res => {
          res.data.forEach(x => {
            let temp = {
              name: x.disease_name,
              description: x.description,
            }
            diagnosisItems.push(temp)
          })
        }).catch((err) => {
          console.log(err)
          this.errorMsg = 'Unexpected Error, could not load data'
        })
        this.item2 = item;
        this.dialog2 = true;
        this.group.headers =[
          { text: 'Name', value: 'name', class: 'datatablefontcolor--text' },
          { text: 'Description', value: 'description', class: 'datatablefontcolor--text' },
        ];
        this.group.items = diagnosisItems
        this.group.tableInfo.tableTitle = 'Diagnosis'
      },
    async handleDialog3(item){
      //waiting for backend
       let prescriptionItems = [];
      await this.$http.get(this.$url+`/patient/${this.id}/see_presc`, {
        params: {
          appointment_id: item.id
        }
      }).then(res => {
        res.data.forEach(x => {
          let temp = {
            name: x.med_name,
            description: x.usage_method
          }
          prescriptionItems.push(temp)
        })
      }).catch((err) => {
          console.log(err)
          this.errorMsg = 'Unexpected Error, could not load data'
        })
          this.item3 = item;
          this.dialog3 = true;
          this.group.headers =[
            { text: 'Medicine Name', value: 'name', class: 'datatablefontcolor--text' },
            { text: 'Description', value: 'description', class: 'datatablefontcolor--text' },
          ];
          this.group.items = prescriptionItems
        this.group.tableInfo.tableTitle = 'Prescriptions'
      },
  },
  mounted() {
    this.getItems()
  },
  created: function() {
      // this.group.items = this.items
      // this.group.headers = this.headers
      // this.group.tableInfo = this.tableInfo
      // this.group.buttonHeader = this.buttonHeader
  }
};
</script>

<style scoped>

</style>