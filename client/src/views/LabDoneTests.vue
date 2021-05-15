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
      // { text: 'Doctor Name', value: 'doctorName', class: 'datatablefontcolor--text' },
      { text: 'Date Assigned', value: 'date', class: 'datatablefontcolor--text' },
      { text: 'Test Name', value: 'testName', class: 'datatablefontcolor--text' },
      { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
      { text: 'Actions', value: 'Edit',sortable:false, class: 'datatablefontcolor--text' }
    ],
    filteredTests: [],
    items:[],
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
    validateForm(){
      this.$refs.form.validate()
      if (this.valid) {
        console.log(this.result)
        this.resultItem.value = this.result
        this.editResultDialog = false
        if (this.resultItem.l_interval !== '-') {
          if ((Number(this.result) >= this.resultItem.l_interval && Number(this.result) <= this.resultItem.h_interval)) {
            this.resultItem.result = 'Normal'
          }
          else{
            this.resultItem.result = 'Abnormal'
          }
        }
        this.result = ''
        let temp = this.compItems.filter(x => x.value === '-')
        if (temp.length === 0) {
          this.item.status = 'Finalised'
          this.msg = 'All results have been finalised, test is moved to the finalised tests tab'
          this.snackbar = true
          this.dialog = false
        }
        this.filteredTests = this.items.filter(x => x.status === 'preparing')
      }
    },
    async getItems(){
      this.overlay = true
      if(this.$cookies.get('user'))
      {
        this.id = this.$cookies.get('user').national_id
        let temp = this.$cookies.get('user').name
        this.laboratorianName = temp.charAt(0).toUpperCase() + temp.slice(1)
      }
      await this.$http.get(this.$url+`/laboratorian/${this.id}/get_tests`).then(res => {
        // console.log(res)
        this.items = []
        res.data.forEach(x => {
          let temp = {
            id: x.result_id,
            // doctor: 'Dr. ' + this.capitalise(x.name, x.surname),
            date: x.assign_date_to_char,
            testName: x.test_name,
            status: x.test_status
          }
          this.items.push(temp)
        })
        this.filteredTests = this.items.filter(x => x.status === 'finalized')
        this.overlay = false
      }).catch((err) => {
        console.log(err)
        this.errorMsg = 'Unexpected Error, could not load data'
        this.overlay = false
        this.snackbar = true
      })
    }
  },
  mounted() {
    this.getItems()
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