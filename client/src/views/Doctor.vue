<template>
  <v-app>
      <v-container class="">
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Welcome Dr.{{doctor}}</h1>
          </v-row>
          <v-row>
            <h4 class="ml-6 blue--text text--lighten-3">You have {{upcoming}} appointment{{!!upcoming ? '' : 's'}} today</h4>
          </v-row>
        </v-col>
      </v-row>
       <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
                <v-col class="d-flex justify-center mx-n7">
                    <v-btn @click="editApt(item)" width="70%" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">View Details</v-btn>
                </v-col>
            </v-row>
          </template>
      </PaginationTable>
    </v-container>
  </v-app>
</template>

<script>
import PaginationTable from "@/components/PaginationTable"
export default {
    data:()=>({
        doctor: 'Sunny',
        upcoming: '',
        buttonHeader:'details',
        headers: [
        {
            text: 'Appointment ID',
            align: 'start',
            // sortable: false,
            // filterable: false,
            value: 'id',
            class: 'datatablefontcolor--text'
        },
        { text: 'Doctor Name', value: 'doctor', class: 'datatablefontcolor--text' },
        { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
        { text: 'Department', value: 'department', class: 'datatablefontcolor--text' },
        { text: 'Details', value: 'details', sortable:false, class: 'datatablefontcolor--text' },
        ],
        items:[],
        dateArray:[],
        tableInfo: {
            tableTitle: 'Upcoming',
            itemsKey: 'id',
            itemsPerPage: 6,
        },
    }),
    components: {
        PaginationTable
    },
    methods:{
        getItemsData(){
            if (localStorage.getItem('items')) {
                try {
                    let parse = JSON.parse(localStorage.getItem('items'));
                    let filtered = parse.filter((x) => Number(x.date.substring(9,10)) === Number(this.toIsoString(new Date).substring(9,10)));
                    this.items = filtered.filter((x) => x.doctor === this.doctor)
                    this.upcoming = this.items.length
                } catch(e) {
                    localStorage.removeItem('items');
                }
                }
                if (localStorage.getItem('dataArray')) {
                try {
                    this.dateArray = JSON.parse(localStorage.getItem('dataArray'));
                } catch(e) {
                    localStorage.removeItem('dataArray');
                }
            }
        },
    },
    mounted() {
        this.getItemsData()
    },
}
</script>

<style>

</style>