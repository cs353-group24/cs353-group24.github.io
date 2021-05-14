<template>
  <v-app>
    <v-container class="">
      <v-row>
        <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Tests</h1>
      </v-row>
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
            <v-col class="d-flex justify-center mx-n8">
                <v-btn @click="handleDialog1(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">See Components</v-btn>
            </v-col>
            </v-row>
          </template>
      </PaginationTable>
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
      <Dialog :tableData="group" :dialog="dialog1" :title="item.calories" @close="dialog1=false">
        <template #tableActions="{item}">
            <v-btn @click="handleDialog2(item)" class="rounded-pill font-weight-bold" outlined color="#5080DE">History</v-btn>
        </template>
      </Dialog>
      <Dialog :tableData="group" back @back="handleBack" :dialog="dialog2" :title="item1.name" @close="dialog2=false"></Dialog>
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
    snackbar: false,
    overlay: false,
    errorMsg: '',
    id:'',
    item:{},
    item1:{},
    group: {
        items:'',
        headers:'',
        tableInfo:'',
        buttonHeader: ''
    },
    dialog1:false,
    dialog2:false,
    buttonHeader: 'details',
    headers: [
    {
        text: 'Appointment ID',
        align: 'start',
        // sortable: false,
        // filterable: false,
        value: 'id',
        class: 'datatablefontcolor--text'
    },
    { text: 'Test Name', value: 'name', class: 'datatablefontcolor--text' },
    { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
    { text: 'Laboratorian', value: 'laboratorian', class: 'datatablefontcolor--text' },
    { text: 'Details', value: 'details', sortable:false, class: 'datatablefontcolor--text' },
    ],
    items: [],
    tableInfo: {
        tableTitle: 'Tests',
        itemsKey: 'name',
        itemsPerPage: 6,
    },
  }),
  methods: {
    async getItems(){
      this.overlay = true
      if(this.$cookies.get('user'))
      {
        this.id = this.$cookies.get('user').national_id
        let temp = this.$cookies.get('user').name
        this.patientName = temp.charAt(0).toUpperCase() + temp.slice(1)
      }
      await this.$http.get(this.$url+`/patient/${this.id}/see_all_tests`).then(res => {
        // console.log(res)
        this.items = []
        res.data.forEach(x => {
          let temp = {
            id: x.appointment_id,
            name: x.test_name,
            date: x.date,
            laboratorian: x.laboratorian_id,
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
    },
        handleBack: function(){
            this.dialog2 = false;
            this.dialog1 = true;
        },
        async handleDialog1(item){
          let componentItems = [];
          this.overlay = true
          await this.$http.get(this.$url+`/patient/${this.id}/see_all_comps`).then(res => {
            // console.log(res)
            res.data.forEach(x => {
              let temp = {
                id: x.result_id,
                name: x.comp_name,
                value: x.comp_value,
                result: x.comp_result,
                status: x.comp_status
              }
              componentItems.push(temp)
            })
            this.overlay = false
          }).catch((err) => {
            console.log(err)
            this.errorMsg = 'Unexpected Error, could not load data'
            this.overlay = false
            this.snackbar = true
          })
            this.item = item;
            this.dialog1 = true;
            this.group.items = componentItems;
            this.group.headers = [
              {
                text: 'Result ID',
                align: 'start',
                // sortable: false,
                // filterable: false,
                value: 'id',
                class: 'datatablefontcolor--text'
              },
              { text: 'Component Name', value: 'name', class: 'datatablefontcolor--text' },
              { text: 'Component Value', value: 'value', class: 'datatablefontcolor--text' },
              { text: 'Component Result', value: 'result', class: 'datatablefontcolor--text' },
              { text: 'Component Status', value: 'status', class: 'datatablefontcolor--text' },
            ];
            this.group.buttonHeader = 'History'
        },
        handleDialog2: function(item){
            this.item1 = item;
            this.dialog1 = false;
            this.dialog2 = true;
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