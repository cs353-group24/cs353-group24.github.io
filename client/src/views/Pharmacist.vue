<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Welcome Dr. {{name}}</h1>
          </v-row>
          <v-row>
            <h4 class="ml-6 blue--text text--lighten-3">You have {{items.length}} waiting prescriptions</h4>
          </v-row>
        </v-col>
      </v-row>
       <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons={item}>
            <v-btn @click="handleDialog(item)" class="font-weight-bold rounded-pill" outlined color="#5080DE">
              Fill Prescription
            </v-btn>
          </template>
      </PaginationTable>
      <Dialog :tableData="group" :item="item" :itemHeader="headers" :dialog="dialog" :dialogMode="'cols'" :title="'Fill Prescription'" @close="dialog=false">
        <template #tableActions={item}>
          <v-btn @click="prescribe(item)" class="font-weight-bold rounded-pill" outlined color="#5080DE">
              Fill Order
          </v-btn>
        </template>
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
    snackbar:false,
    errorMsg: '',
    overlay: false,
    name: '',
    item:{},
    id: '',
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
        tableTitle: 'Waiting Prescriptions',
        itemsKey: 'presid',
        itemsPerPage: 6,
    },
    group: {
        items: [],
        headers: [
          { text: 'Name', align: 'start', value: 'name', class: 'datatablefontcolor--text' },
          { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
          { text: 'Quantity', value: 'qty', class: 'datatablefontcolor--text' },
          { text: 'Usage Description', value: 'usg', class: 'datatablefontcolor--text' },
          { text: 'Actions', value: 'actions', class: 'datatablefontcolor--text' },
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
      async prescribe(item){
        // this function will deduct item.qty from the medicine(item.name) stock left
        // will also have a check, if qty of medicine is less than order qty, this.snackbar=true
        this.overlay = true
        await this.$http.get(this.$url + `/pharmacist/this.id/def_medicine_search`, {
          params: {
            name: item.name
          }
        }).then(res => {
          console.log(res)
          if(item.qty <= res.data[0].stock){
            this.$http.post(this.$url + `/pharmacist/${this.id}/fill_med`, {
              prescription_id: this.item.presid,
              status: 'filled',
              qty: item.qty,
              medicine_name: item.name
            }).then(res => {
              console.log(res)
              item.status = 'Filled'
              let temp = this.group.items.filter(x => (x.status !== 'filled' && x !== item))
              console.log(temp)
              if(temp.length === 0)
              {
                this.errorMsg = 'Filled prescription has been moved to the filled prescription tab'
                this.snackbar = true
                this.dialog = false
                this.getItems()
              }
            }).catch(err => {
              console.log(err.response)
              this.errorMsg = 'Unknown error, try again'
              this.snackbar = true
              this.dialog = false
            })
          }
          else{
            throw new Error
          }
        }).catch(err => {
          console.log(err)
          if(err instanceof Error)
          {
            this.errorMsg = 'Not enough stock for this medicine, you have to order more'
          }
          else{
            this.errorMsg = 'Unknown error, try again'
          }
          this.snackbar = true
          this.dialog = false
        }).finally(() => {
          this.overlay = false
        })
      },
      async getItems(){
        this.overlay = true
        await this.$http.get(this.$url + `/pharmacist/${this.id}/get_all_prescriptions`).then(res => {
          this.items = []
          console.log(res)
          res.data.forEach(x => {
            if (x.status === 'waiting') {
              this.items.push({
                presid: x.prescription_no,
                apid: x.appointment_id,
                doctor: 'Dr. ' + this.capitalise(x.name, x.surname),
                date: x.date_to_char,
                status: this.capitalise(x.status)
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
      // console.log(this.$cookies.get('user'))
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