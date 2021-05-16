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
  components: {
    PaginationTable, Dialog
  },

  data: () => ({
    snackbar: false,
    overlay: false,
    errorMsg: '',
    id:'',
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
        value: 'id',
        class: 'datatablefontcolor--text'
    },
    { text: 'Prescription No', value: 'pres_no', class: 'datatablefontcolor--text' },
    { text: 'Prescription Type', value: 'pres_type', class: 'datatablefontcolor--text' },
    { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
    { text: 'Details', value: 'details', sortable:false, class: 'datatablefontcolor--text' },
    ],
    items: [],
    tableInfo: {
        tableTitle: 'Prescriptions',
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
      }
      await this.$http.get(this.$url+`/patient/${this.id}/see_all_presc`).then(res => {
        // console.log(res)
        this.items = []
        res.data.forEach(x => {
          let temp = {
            id: x.appointment_id,
            pres_no: x.prescription_no,
            pres_type: x.prescription_type,
            date: x.date_to_char
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
      async handleDialog1(item){
        this.overlay = true
        await this.$http.get(this.$url+`/patient/${this.id}/see_presc`, {
          params:{
            appointment_id: item.id
          }
        }).then(res => {
          // console.log(res)
          this.group.items = []
          res.data.forEach(x => {
            let temp = {
              name: x.med_name,
              qty: x.qty,
              desc: x.usage_method,
            }
            this.group.items.push(temp)
            this.group.headers =[
              {
                text: 'Name',
                align: 'start',
                // sortable: false,
                // filterable: false,
                value: 'name',
                class: 'datatablefontcolor--text'
              },
              { text: 'Quantity', value: 'qty', class: 'datatablefontcolor--text' },
              { text: 'Description', value: 'desc', class: 'datatablefontcolor--text' },
            ]
          })
          this.overlay = false
        }).catch((err) => {
          console.log(err)
          this.errorMsg = 'Unexpected Error, could not load data'
          this.overlay = false
          this.snackbar = true
        })
          this.item = item;
          this.dialog = true;
      },
  },
  mounted() {
    this.getItems()
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