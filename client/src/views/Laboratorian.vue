<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Welcome Dr. {{doctorName}}</h1>
          </v-row>
          <v-row>
            <h4 class="ml-6 blue--text text--lighten-3">You have {{upcoming}} upcoming appointments</h4>
          </v-row>
        </v-col>
      </v-row>
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
        <template #buttons="{item}">
          <v-row>
            <v-col class="d-flex justify-center mx-n8">
              <v-btn @click="editTest(item); $router.push({ path: '/laboratorian/edit/' + item.id})" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Edit</v-btn>
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
name: "Laboratorian",
  components:{
    PaginationTable
  },
  data: () => ({
    group:{
      items:[],
      headers:[],
      tableInfo: [],
      buttonHeader: ''
    },
    buttonHeader: 'Edit',
    item: '',
    headers: [
      { text: 'Test ID', align: 'start',  value: 'id', class: 'datatablefontcolor--text'},
      { text: 'Doctor Name', value: 'doctorName', class: 'datatablefontcolor--text' },
      { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
      { text: 'Test Name', value: 'testName', class: 'datatablefontcolor--text' },
      { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
      { text: 'Actions', value: 'Edit',sortable:false, class: 'datatablefontcolor--text' },
    ],
    items:[
      {
        id: 8845,
        doctorName: 'Dr. Sunny',
        date: '22.04.2021',
        testName: 'BloodTest',
        status: 'Assigned'
      }
    ],
    tableInfo: {
      tableTitle: 'Tests',
      itemsKey: 'id',
      itemsPerPage: 6,
    },
    upcoming: 5,
    doctorName: "Mohi",

  }),
  methods:{
    editTest: function (item){
      this.item = item;
    }
  },
  created: function() {
    this.group.items = this.items
    this.group.headers = this.headers
    this.group.tableInfo = this.tableInfo
    this.group.buttonHeader = this.buttonHeader
  }
}
</script>

<style scoped>

</style>