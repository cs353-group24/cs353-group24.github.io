<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Filled Prescriptions</h1>
          </v-row>
        </v-col>
      </v-row>
       <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons={item}>
            <v-btn @click="handleDialog(item)" class="font-weight-bold rounded-pill" outlined color="#5080DE">
              View Prescription
            </v-btn>
          </template>
      </PaginationTable>
      <Dialog :tableData="group" :item="item" :itemHeader="headers" :dialog="dialog" :dialogMode="'cols'" :title="'View Prescription'" @close="dialog=false">
      </Dialog>
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
import PaginationTable from "@/components/PaginationTable"
import Dialog from "@/components/Dialog"
export default {
  components:{PaginationTable, Dialog},
  data: ()=>({
    errorMsg: '',
    overlay: false,
    snackbar: false,
    id: '', 
    name: '',
    item:{},
    dialog: false,
    buttonHeader: 'buttons',
    headers: [
      { text: 'Prescription ID', align: 'start', value: 'presid', class: 'datatablefontcolor--text' },
      { text: 'Appointment ID', value: 'apid', class: 'datatablefontcolor--text' },
      { text: 'Doctor', value: 'doctor', class: 'datatablefontcolor--text' },
      { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
      { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
      { text: 'Interact', value: 'buttons', class: 'datatablefontcolor--text' },
    ],
    items:[],
    tableInfo: {
        tableTitle: 'Filled Prescriptions',
        itemsKey: 'presid',
        itemsPerPage: 5,
    },
    group: {
        items:[],
        headers: [
          { text: 'Name', align: 'start', value: 'name', class: 'datatablefontcolor--text' },
          { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
          { text: 'Quantity', value: 'qty', class: 'datatablefontcolor--text' },
          { text: 'Usage Description', value: 'usg', class: 'datatablefontcolor--text' },
        ],
        tableInfo: {
          tableTitle: 'Prescription Details',
          itemsKey: 'name',
          itemsPerPage: 5
        },
        buttonHeader: 'actions'
    },
  }),
  methods: {
          async handleDialog(item){
          this.item = item;
          this.overlay = true
          await this.$http.get(this.$url + `/pharmacist/${this.id}/get_prescription_details`, {
            params: {
              prescription_no: item.presid
            }
          }).then(res => {
            console.log(res)
            this.group.items = []
            res.data.forEach(x => {
              this.group.items.push({
                name: this.capitalise(x.med_name),
                status: this.capitalise(x.med_status),
                qty: x.qty,
                usg: x.usage_method
              })
            }) 
          }).catch(err => {
            console.log(err)
            this.errorMsg = 'Unknown error, try again later'
            this.snackbar = true
          }).finally(() => {
            this.overlay = false
          })
          this.dialog = true;
      },
      async getItems(){
        this.overlay = true
        await this.$http.get(this.$url + `/pharmacist/${this.id}/get_all_prescriptions`).then(res => {
          this.items = []
          console.log(res)
          res.data.forEach(x => {
            if (x.status === 'filled') {
              this.items.push({
                presid: x.prescription_no,
                apid: x.appointment_id,
                doctor: 'Dr. ' + this.capitalise(x.name, x.surname),
                date: x.date_to_char,
                status: x.status
              })
            }
          })
        }).catch(err => {
          console.log(err.response)
          this.errorMsg = 'Unknown Error, please try again later'
          this.snackbar = true
        }).finally(() => {
          this.overlay = false
        })
      }
  },
  created() {
      this.id = this.$cookies.get('user').national_id
      let temp = this.$cookies.get('user').name
      let temp1 = this.$cookies.get('user').surname
      this.name = this.capitalise(temp, temp1)
      this.getItems()
  }
}
</script>

<style>

</style>