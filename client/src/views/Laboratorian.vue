<template>
  <v-app>
    <v-container>
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Welcome {{ laboratorianName }}</h1>
          </v-row>
          <v-row>
            <h4 class="ml-6 blue--text text--lighten-3">You have {{ filteredTests.length }} waiting tests</h4>
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
import PaginationTable from "@/components/PaginationTable";
import Dialog from "@/components/Dialog"
export default {
name: "Laboratorian",
  components:{
    PaginationTable, Dialog
  },
  data: () => ({
    snackbar: false,
    overlay: false,
    errorMsg: '',
    id:'',
    result: '',
    editResultDialog: false,
    valid: false,
    dialog:false,
    laboratorianName: '',
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
      { text: 'Add Result', align: 'start',  value: 'Edit', class: 'datatablefontcolor--text'},
    ],
    compTableInfo: {
      tableTitle: 'Test Components',
      itemsKey: 'component, resultID',
      itemsPerPage: 6,
    },
    compItems:[],

  }),
  methods:{
    async editTest(item){
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
                l_interval: x.lower_normality_interval,
                h_interval: x.upper_normality_interval,
                value: x.comp_value,
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
    async editResult(item){
      if (this.$refs.form) {
        this.$refs.form.resetValidation()
      }
      this.resultItem = item
      console.log(this.resultItem)
      this.editResultDialog = true

    },
    async validateForm(){
      this.overlay = true
      this.$refs.form.validate()
      if (this.valid) {
        this.resultItem.value = this.result
        this.editResultDialog = false
        this.dialog=false
        this.snackbar = true

        if (this.resultItem.l_interval !== '-') {
          if (Number(this.result) >= this.resultItem.l_interval && Number(this.result) <= this.resultItem.h_interval) {
            this.resultItem.result = 'Normal'
          }
          else{
            this.resultItem.result = 'Abnormal'
          }
        }
        this.result = ''
        this.overlay = false
        await this.$http.post(this.$url + `/laboratorian/{this.id}/post_spec_comps`, {
          result_id : this.resultItem.resultID,
          comp_name: this.resultItem.component,
          comp_value: this.resultItem.value
        }).then(() => {
          this.getItems()
        }).catch(err => {
          console.log(err)
          this.errorMsg = 'Unexpected Error in posting comp_value'
          this.overlay = false
        })
      }
    },
    async resetValidation () {
      this.overlay = true
      if(this.$refs.form) {
        this.$refs.form.resetValidation()
      }
      this.overlay = false
      this.dialog=true;
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
        // console.log(res)
        this.items = []
        res.data.forEach(x => {
          let temp = {
            id: x.appointment_id,
            patient: this.capitalise(x.name, x.surname),
            date: x.assign_date_to_char,
            testName: x.test_name,
            status: x.test_status
          }
          this.items.push(temp)
        })
        this.filteredTests = this.items.filter(x => x.status === 'assigned')
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
    this.filteredTests = this.items.filter(x => x.status === 'assigned')
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