<template>
    <v-app>
        <v-container>
            <v-row>
        <v-col>
          <v-row class="d-flex">
              <v-col cols="3"><h1 class="ml-5 mt-16 mb-n10 pt-5 datatablefontcolor--text">Reports</h1></v-col>
              <v-col class="mb-n16 mt-16 pt-5 ml-16 pl-16">
                  <v-radio-group
                    v-model="row"
                    row
                    class="d=flex justify-end align-end pt-8 ml-16 pl-16"
                    >
                    <v-radio
                        label="Appointments in the last month"
                        value="apt"
                    ></v-radio>
                    <v-radio
                        label="Number of tests finalized"
                        value="test"
                    ></v-radio>
                    </v-radio-group>
              </v-col>
            </v-row>
        </v-col>
      </v-row>
            <v-row class="mt-7">
                <v-col v-if="row==='apt'">
                    <PaginationTable :items="aptitems" :headers="aptheaders" :tableInfo="apttableInfo" :buttonHeader="aptbuttonHeader" style="margin-top:1.5rem" class="mx-2">
                    
                </PaginationTable>
                </v-col>
                <v-col v-if="row==='test'">
                    <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
                    
                </PaginationTable>
                </v-col>
            </v-row>
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
import PaginationTable from "@/components/PaginationTable"
export default {
    data:() => ({
        row: 'apt',
        snackbar: false,
        overlay: false,
        errorMsg: '',
        aptitems:[],
        item:[],
        aptheaders: [
        {
            text: 'Doctor ID',
            align: 'start',
            // sortable: false,
            // filterable: false,
            value: 'id',
            class: 'datatablefontcolor--text'
        },
        { text: 'Doctor Name', value: 'doctor', class: 'datatablefontcolor--text' },
        { text: 'No. of Appointments', value: 'no', class: 'datatablefontcolor--text' },
        ],
        headers: [
        {
            text: 'Patient ID',
            align: 'start',
            // sortable: false,
            // filterable: false,
            value: 'id',
            class: 'datatablefontcolor--text'
        },
        { text: 'Patient Name', value: 'doctor', class: 'datatablefontcolor--text' },
        { text: 'Total no. of Tests', value: 'total', class: 'datatablefontcolor--text' },
        { text: 'No. of Tests finalised', value: 'no', class: 'datatablefontcolor--text' },
        ],
        apttableInfo: {
            tableTitle: 'No. of Appointments in the last month',
            itemsKey: 'id',
            itemsPerPage: 6,
        },
        aptbuttonHeader: 'actions',
        tableInfo: {
            tableTitle: 'No. of tests finalized per patient',
            itemsKey: 'id',
            itemsPerPage: 6,
        },
        buttonHeader: 'actions'
    }),
    components: {
        PaginationTable
    },
    methods:{
        async getData(){
            this.overlay = true
            await this.$http.get(this.$url + `/report2`).then(res => {
                // // console.log(res)
                this.aptitems = []
                res.data.forEach(x => {
                    this.aptitems.push({
                        id: x.doctor_id,
                        doctor: this.capitalise(x.name, x.surname),
                        no: x.no_of_appointments_last_month
                    })
                })
            }).catch(err => {
                console.log(err.response)
            }).finally(()=>{
                this.overlay = false
            })
        },
        async getData1(){
            this.overlay = true
            await this.$http.get(this.$url + `/report1`).then(res => {
                // console.log(res)
                this.items = []
                res.data.forEach(x => {
                    this.items.push({
                        id: x.patient_id,
                        doctor: this.capitalise(x.name, x.surname),
                        total: x.total_no_of_tests,
                        no: x.no_of_finalised_tests
                    })
                })
            }).catch(err => {
                console.log(err.response)
            }).finally(()=>{
                this.overlay = false
            })
        }
    },
    created(){
        this.getData()
        this.getData1()
    }
}
</script>

<style>

</style>