<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-row>
            <h4 class="ml-5 mt-10 pt-5 datatablefontcolor--text">You have {{items.length}} tests finalised</h4>
          </v-row>
        </v-col>
      </v-row>
      <PaginationTable :items="filteredTests" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
        <template #buttons="{item}">
          <v-row>
            <v-col class="d-flex justify-center mx-n8">
              <v-btn @click="viewTest(item);" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">View</v-btn>
            </v-col>
          </v-row>
        </template>
      </PaginationTable>
      <Dialog :tableData="group" :item="item" :itemHeader="headers" :dialog="dialog" :dialogMode="'cols'" :title="'Edit Test Results'" @close="dialog=false">
      </Dialog>
    </v-container>
  </v-app>
</template>

<script>
import PaginationTable from "@/components/PaginationTable";
import Dialog from "@/components/Dialog"
export default {
name: "Laboratorian",
  components:{
    PaginationTable, Dialog
  },
  data: () => ({
    dialog:false,
    group:{
      items:[],
      headers:[],
      tableInfo: [],
      buttonHeader: ''
    },
    buttonHeader: 'Edit',
    item: {},
    resultItem: {},
    headers: [
      { text: 'Test ID', align: 'start',  value: 'id', class: 'datatablefontcolor--text'},
      { text: 'Doctor Name', value: 'doctorName', class: 'datatablefontcolor--text' },
      { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
      { text: 'Test Name', value: 'testName', class: 'datatablefontcolor--text' },
      { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
      { text: 'Actions', value: 'Edit',sortable:false, class: 'datatablefontcolor--text' },
    ],
    filteredTests: [],
    items:[
      {
        id: 8845,
        doctorName: 'Dr. Sunny',
        date: '22.04.2021',
        testName: 'BloodTest',
        status: 'Finalised'
      }
    ],
    tableInfo: {
      tableTitle: 'Tests Finalised',
      itemsKey: 'id',
      itemsPerPage: 6,
    },
    compHeaders: [
      { text: 'Component', align: 'start',  value: 'component', class: 'datatablefontcolor--text'},
      { text: 'Result ID', align: 'start',  value: 'resultID', class: 'datatablefontcolor--text'},
      { text: 'Lower Interval', align: 'start',  value: 'l_interval', class: 'datatablefontcolor--text'},
      { text: 'Upper Interval', align: 'start',  value: 'h_interval', class: 'datatablefontcolor--text'},
      { text: 'Value', align: 'start',  value: 'value', class: 'datatablefontcolor--text'},
      { text: 'Result', align: 'start',  value: 'result', class: 'datatablefontcolor--text'},
    ],
    compTableInfo: {
      tableTitle: 'Test Components',
      itemsKey: 'component, resultID',
      itemsPerPage: 6,
    },
    compItems:[
      {
        component: 'Creatin Kinase',
        resultID: 6745,
        l_interval: 0,
        h_interval: 190,
        value: '23',
        result: 'Normal'
      },
      {
        component: 'Creatin Kinase',
        resultID: 6745,
        l_interval: 0,
        h_interval: 190,
        value: '25',
        result: 'normal'
      }
    ],

  }),
  methods:{
    viewTest: function (item){
      this.item = item;
      this.dialog=true
    },
  },
  created: function() {
    this.group.items = this.compItems
    this.group.headers = this.compHeaders
    this.group.tableInfo = this.compTableInfo
    this.group.buttonHeader = this.buttonHeader
    this.filteredTests = this.items.filter(x => x.status === 'Finalised')
  },
  computed: {
    
  }
}
</script>

<style scoped>

</style>