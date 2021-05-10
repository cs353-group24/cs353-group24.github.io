<template>
  <v-app>
    <v-container>
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
        <template #buttons="{item}">
          <v-row>
            <v-col class="d-flex justify-center mx-n8">
              <v-btn @click="editTest(item);  item.status == 'Finalized' ? $router.push({ path: '/laboratorian/edit/' + item.id}): ''" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">
                {{ item.status == 'Finalized' ? 'Edit' : 'View'  }}</v-btn>
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
  name: "LabTests",
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
      },
      {
        id: 8845,
        doctorName: 'Dr. Sunny',
        date: '22.04.2021',
        testName: 'BloodTest',
        status: 'Finalized'
      }
    ],
    tableInfo: {
      tableTitle: 'Tests',
      itemsKey: 'id',
      itemsPerPage: 6,
    }
  }),
  methods:{
    editTest: function (item){
      this.item = item;
    }
  }
}
</script>

<style scoped>

</style>