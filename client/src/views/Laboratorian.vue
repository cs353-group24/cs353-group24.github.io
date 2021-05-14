<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Welcome Dr. Mohi</h1>
          </v-row>
          <v-row>
            <h4 class="ml-6 blue--text text--lighten-3">You have {{items.length}} waiting tests</h4>
          </v-row>
        </v-col>
      </v-row>
      <PaginationTable :items="filteredTests" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
        <template #buttons="{item}">
          <v-row>
            <v-col class="d-flex justify-center mx-n8">
              <v-btn @click="editTest(item);" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Edit</v-btn>
            </v-col>
          </v-row>
        </template>
      </PaginationTable>
      <Dialog :tableData="group" :item="item" :itemHeader="headers" :dialog="dialog" :dialogMode="'cols'" :title="'Edit Test Results'" @close="dialog=false">
        <template #tableActions={item}>
          <v-btn @click="editResult(item)" class="font-weight-bold rounded-pill" outlined color="#5080DE">
              Edit
          </v-btn>
        </template>
      </Dialog>
      <v-dialog
        v-model="editResultDialog"
        persistent
        max-width="30vw"
      >
        <v-card>
          <v-card-title class="headline datatablefontcolor--text text-center">
            Edit {{resultItem.component}} Result
          </v-card-title>
          <v-card-text class="mt-4">
            <!-- maybe use cached items prop -->
            <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="result"
              clearable
              :rules="[v => !!v || 'Value is required']"
              prepend-inner-icon="mdi-pencil"
              :label="resultLabel"
              outlined
            ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="datatablefontcolor"
              text
              @click="editResultDialog=false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="datatablefontcolor"
              text
              @click="validateForm"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar
        v-model="snackbar"
        :timeout="5000"
      >
        {{msg}}

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
import PaginationTable from "@/components/PaginationTable";
import Dialog from "@/components/Dialog"
export default {
name: "Laboratorian",
  components:{
    PaginationTable, Dialog
  },
  data: () => ({
    snackbar: false,
    msg: '',
    result: '',
    editResultDialog: false,
    valid: false,
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
        status: 'Assigned'
      }
    ],
    tableInfo: {
      tableTitle: 'Tests Waiting',
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
      { text: 'Edit', align: 'start',  value: 'Edit', class: 'datatablefontcolor--text'},
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
        value: '-',
        result: '-'
      },
      {
        component: 'Creatin Kinase',
        resultID: 6745,
        l_interval: 0,
        h_interval: 190,
        value: '-',
        result: '-'
      }
    ],

  }),
  methods:{
    editTest: function (item){
      this.item = item;
      this.dialog=true
    },
    editResult(item){
      if (this.$refs.form) {
        this.$refs.form.resetValidation
      }
      this.resultItem = item
      this.editResultDialog = true
    },
    validateForm(){
      this.$refs.form.validate()
      if (this.valid) {
        console.log(this.result)
        this.resultItem.value = this.result
        this.editResultDialog = false
        this.dialog=false
        this.item.status = 'Preparing'
        this.snackbar = true
        await this.$http.post(this.$url + `/patient/${this.id}/appointment/newappointment`, {
          date: this.appointment.date,
          doctor_id: this.appointment.doctor.id
        })
        this.msg = `Test: ${this.item.id} moved to the preparing tests page`
        this.filteredTests = this.items.filter(x => x.status === 'Assigned')
        if (this.resultItem.l_interval !== '-') {
          if (Number(this.result) >= this.resultItem.l_interval && Number(this.result) <= this.resultItem.h_interval) {
            this.resultItem.result = 'Normal'
          }
          else{
            this.resultItem.result = 'Abnormal'
          }
        }
        this.result = ''
      }
    }
  },
  created: function() {
    this.group.items = this.compItems
    this.group.headers = this.compHeaders
    this.group.tableInfo = this.compTableInfo
    this.group.buttonHeader = this.buttonHeader
    this.filteredTests = this.items.filter(x => x.status === 'Assigned')
  },
  computed: {
    resultLabel(){
      return this.resultItem.component + ' Value'
    }
  }
}
</script>

<style scoped>

</style>