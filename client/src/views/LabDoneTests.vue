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
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
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
      { text: 'Appointment ID', align: 'start',  value: 'id', class: 'datatablefontcolor--text'},
      { text: 'Patient Name', value: 'patient', class: 'datatablefontcolor--text' },
      { text: 'Date Due', value: 'date', class: 'datatablefontcolor--text' },
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
      { text: 'Result', align: 'start',  value: 'result', class: 'datatablefontcolor--text'}
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
    async viewTest(item){
      this.overlay = true

      this.item = item;
      await this.$http.get(this.$url+`/laboratorian/${this.id}/get_spec_comps`, {
        params: {
          appointment_id : this.item.id,
          test_name: this.item.testName
        }
      }).then((res) => {
        res.data.forEach(x => {
          let comp = {
            component: x.comp_name,
            resultID: x.result_id,
            l_interval: (x.lower_normality_interval == null) ? '-' : x.lower_normality_interval,
            h_interval: (x.upper_normality_interval == null) ? '-': x.upper_normality_interval,
            value: (x.comp_value == null) ? '-' : x.comp_value,
            result: (x.comp_result == null) ? '-' : x.comp_result,
            date: (x.result_date_to_char == null)? '-': x.result_date_to_char
          }
          this.compItems.push(comp)
        })
      }).catch(e => {
        if (e.response) {
          if (e.response.status === 403) {
            this.errorMsg = 'No such email, try again'
          } else if (e.response.status === 402) {
            this.errorMsg = 'Wrong password, try again'
          }
        } else {
          this.errorMsg = 'Unknown error'
        }
      })
      this.compItems = []
      this.dialog = true
      this.snackbar = true
      this.overlay = false
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
      await this.$http.get(this.$url+`/laboratorian/${this.id}/homepage`).then(res => {
        console.log(res)
        this.items = []
        res.data.filter(x => x.test_status === 'finalized' ).forEach(x => {
          let temp = {
            id: x.appointment_id,
            patient: this.capitalise(x.name, x.surname),
            date: (x.assign_date_to_char == null) ? '-' : x.assign_date_to_char,
            testName: x.test_name,
            status: (x.test_status == null) ? '-' : x.test_status
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
      this.overlay = false
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
    this.filteredTests = this.items.filter(x => x.status === 'Finalized')
  },
  computed: {
    
  }
}
</script>

<style scoped>

</style>