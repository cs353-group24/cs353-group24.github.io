<template>
  <v-app>
    <v-container class="">
      <v-row>
        <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Past Appointments</h1>
      </v-row>
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
            <v-col class="d-flex justify-center mx-n5">
                <v-btn @click.stop="handleDialog1(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Symptoms</v-btn>
            </v-col>
            <v-col class="d-flex justify-center ml-n8">
                <v-btn @click.stop="handleDialog2(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Diagnosis</v-btn>
            </v-col>
            <v-col class="d-flex justify-center ml-n10">
                <v-btn @click.stop="handleDialog3(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Prescription</v-btn>
            </v-col>
            </v-row>
          </template>
      </PaginationTable>
      <Dialog :tableData="group" :item="item1" :itemHeader="headers" :dialogMode="'cols'" :dialog="dialog1" :title="'Symptoms'" @close="dialog1=false"></Dialog>
      <Dialog :tableData="group" :item="item2" :itemHeader="headers" :dialogMode="'cols'" :dialog="dialog2" :title="'Diagnosis'" @close="dialog2=false"></Dialog>
      <Dialog :tableData="group" :item="item3" :itemHeader="headers" :dialogMode="'cols'" :dialog="dialog3" :title="'Prescription'" @close="dialog3=false"></Dialog>
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
    item1:{},
    item2:{},
    item3:{},
    group: {
        items:'',
        headers:'',
        tableInfo:'',
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
        value: 'name',
        class: 'datatablefontcolor--text'
    },
    { text: 'Doctor Name', value: 'calories', class: 'datatablefontcolor--text' },
    { text: 'Date', value: 'fat', class: 'datatablefontcolor--text' },
    { text: 'Time', value: 'carbs', class: 'datatablefontcolor--text' },
    { text: 'Department', value: 'protein', class: 'datatablefontcolor--text' },
    { text: 'Iron', value: 'iron', class: 'datatablefontcolor--text' },
    { text: 'Details', value: 'details', sortable:false, class: 'datatablefontcolor--text' },
    ],
    items: [
    {
        name: 1010,
        calories: 'Dr Mohla',
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%',
    },
    {
        name: 1100,
        calories: 'Dr Royim',
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: '1%',
    },
    {
        name: 1141,
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: '7%',
    },
    
    ],
    tableInfo: {
        tableTitle: 'Past Appointments',
        itemsKey: 'name',
        itemsPerPage: 6,
    },
  }),
  methods: {
      handleDialog1: function(item){
          // console.log(this.group);
          this.item1 = item;
          this.dialog1 = true;
      },
      handleDialog2: function(item){
          this.item2 = item;
          this.dialog2 = true;
      },
      handleDialog3: function(item){
          this.item3 = item;
          this.dialog3 = true;
      },
  },
  created: function() {
      this.group.items = this.items
      this.group.headers = this.headers
      this.group.tableInfo = this.tableInfo
      this.group.buttonHeader = this.buttonHeader
  }
};
</script>

<style scoped>

</style>