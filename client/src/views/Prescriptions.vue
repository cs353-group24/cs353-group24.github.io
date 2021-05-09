<template>
  <v-app>
    <v-container class="">
      <v-row>
        <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Prescriptions</h1>
      </v-row>
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
            <v-col class="d-flex justify-center mx-n5">
                <v-btn @click="handleDialog1(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">View Details</v-btn>
            </v-col>
            </v-row>
          </template>
      </PaginationTable>
      <Dialog :tableData="group" :item="item" :itemHeader="headers" :dialog="dialog" :dialogMode="'cols'" :title="'Prescriptions'" @close="dialog=false"></Dialog>
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
    item:{},
    group: {
        items:'',
        headers:'',
        tableInfo:'',
        buttonHeader: ''
    },
    dialog: false,
    buttonHeader: 'details',
    headers: [
    {
        text: 'Appointment ID',
        align: 'start',
        // sortable: false,
        // filterable: false,
        value: 'name',
        class: 'datatablefontcolor--text'
    },
    { text: 'Prescription No', value: 'calories', class: 'datatablefontcolor--text' },
    { text: 'Prescription Type', value: 'fat', class: 'datatablefontcolor--text' },
    { text: 'Pharmacist', value: 'carbs', class: 'datatablefontcolor--text' },
    { text: 'Date', value: 'protein', class: 'datatablefontcolor--text' },
    { text: 'Extra', value: 'iron', class: 'datatablefontcolor--text' },
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
        tableTitle: 'Prescriptions',
        itemsKey: 'name',
        itemsPerPage: 6,
    },
  }),
  methods: {
      handleDialog1: function(item){
          // console.log(this.group);
          this.item = item;
          this.dialog = true;
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