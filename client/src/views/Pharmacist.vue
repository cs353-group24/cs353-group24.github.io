<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Welcome Dr. Mohi</h1>
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
        :vertical="vertical"
        :timeout="5000"
      >
        Not enough stock left to fill order, you can order more in the inventory tab

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
    item:{},
    dialog: false,
    buttonHeader: 'buttons',
    headers: [
      { text: 'Prescription ID', align: 'start', value: 'presid', class: 'datatablefontcolor--text' },
      { text: 'Appointment ID', value: 'apid', class: 'datatablefontcolor--text' },
      { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
      { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
      { text: 'Interact', value: 'buttons', class: 'datatablefontcolor--text' },
    ],
    items:[
      { presid: 43, apid: 45, date: '2021-05-25', status: 'waiting'},
      { presid: 44, apid: 46, date: '2021-06-25', status: 'waiting'},
      { presid: 45, apid: 47, date: '2021-07-25', status: 'waiting'},
      { presid: 46, apid: 48, date: '2021-08-25', status: 'waiting'},
      { presid: 47, apid: 49, date: '2021-09-25', status: 'waiting'},
    ],
    tableInfo: {
        tableTitle: 'Waiting Prescriptions',
        itemsKey: 'presid',
        itemsPerPage: 6,
    },
    group: {
        items:'',
        headers:'',
        tableInfo:'',
        buttonHeader: ''
    },
  }),
  methods: {
      handleDialog(item){
          this.item = item;
          this.dialog = true;
      },
      prescribe(item){
        // this function will deduct item.qty from the medicine(item.name) stock left
        // will also have a check, if qty of medicine is less than order qty, this.snackbar=true
        this.snackbar = true
        console.log(item)
      },
  },
  created() {
      this.group.items = this.items
      this.group.headers = this.headers
      this.group.tableInfo = this.tableInfo
      this.group.buttonHeader = this.buttonHeader
  }
}
</script>

<style>

</style>