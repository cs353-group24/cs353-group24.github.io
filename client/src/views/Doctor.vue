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
       <PaginationTable :items="items" :headers="headers" :tableInfo="doctortableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
                <v-col class="d-flex justify-center mx-n7">
                    <v-btn @click="getDetails(item)" width="70%" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">View Details</v-btn>
                </v-col>
            </v-row>
          </template>
      </PaginationTable>
      <AppointmentDetails :appointment="appointment" :tableInfo="tableInfo" :lists="lists" :model="dialog"
            @removeSymptom="removeSymptom($event)"
            @symptomAdd="symptomAdd($event)"
            @removeTest="removeTest($event)"
            @testAdd="addTest($event)"
            @removePres="removePres($event)"
            @addPres="addPres($event)"
            @validateForm="validateForm"
            @diagnosis="diagnosis"
            @close="dialog=false"
        >
        </AppointmentDetails>
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
import AppointmentDetails from "@/components/AppointmentDetails"
export default {
    data:()=>({
      snackbar: false,
      overlay: false,
      errorMsg: '',
      id:'',
        dialog: false,
        tableInfo: {
            symptomItems: [
                {
                    name: 'Weird Ass Disease',
                    details: 'Patient got a boner and took a massive shit of equal size. Patient then started spinning in circles until he flew off into space like a helicopter. I wanna quit my job.'
                },
            ],
            presItems: [],
            testItems: [],
        },
        lists: {
            symptomsList: [
                {
                    name: 'Fever', 
                    details: 'Body temp is higher than normal'
                }, 
                {
                    name: 'Cold',
                    details: 'Patient has the sniffles'
                }
            ],
            presList: [
                {
                    name: 'Paracetamol',
                    man: 'Big Pharma'
                },
                {
                    name: 'Kalpol',
                    man: 'Small Pharma'
                },
                {
                    name: 'Wilgesic',
                    man: 'Medium Pharma'
                },
            ],
            testsList: ['Blood Test', 'X-Ray', 'Ultrasound', 'MRI'],
            compList: [],
            labsList: ['Sunny', 'Mohi', 'Atakan', 'Arnissa'], 
            diseaseList: ['Malaria', 'HIV', 'Crabs', 'Chlamydia' ],
        },
        appointment: {
            id: '',
            pid: '',
            name: 'Mohi The Sicko',
            date: '',
            age: '',
        },
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
        { text: 'Patient Name', value: 'patient', class: 'datatablefontcolor--text' },
        { text: 'Date', value: 'date', class: 'datatablefontcolor--text' },
        { text: 'Details', value: 'details', sortable:false, class: 'datatablefontcolor--text' },
        ],
        items:[],
        dateArray:[],
        doctortableInfo: {
            tableTitle: 'Upcoming',
            itemsKey: 'id',
            itemsPerPage: 6,
        },
    }),
    components: {
        PaginationTable, AppointmentDetails
    },
    methods:{
        async getItemsData(){
          this.overlay = true
          if(this.$cookies.get('user'))
          {
            this.id = this.$cookies.get('user').national_id
            let temp = this.$cookies.get('user').name
            this.patientName = temp.charAt(0).toUpperCase() + temp.slice(1)
          }
          await this.$http.get(this.$url+`/doctor/${this.id}/homepage`).then(res => {
            console.log(res)
            this.items = []
            res.data.forEach(x => {
              let temp = {
                id: x.appointment_id,
                patient: this.capitalise(x.name, x.surname),
                date: x.date,
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



            if (localStorage.getItem('dataArray')) {
            try {
                this.dateArray = JSON.parse(localStorage.getItem('dataArray'));
            } catch(e) {
                localStorage.removeItem('dataArray');
            }
            }
            if (localStorage.getItem('symptomItems')) {
                try {
                    this.tableInfo.symptomItems = JSON.parse(localStorage.getItem('symptomItems'));
                    // console.log(this.events)
                } catch(e) {
                    localStorage.removeItem('symptomItems');
                }
            }
            if (localStorage.getItem('testItems')) {
                try {
                    this.tableInfo.testItems = JSON.parse(localStorage.getItem('testItems'));
                    // console.log(this.events)
                } catch(e) {
                    localStorage.removeItem('testItems');
                }
            }
            if (localStorage.getItem('presItems')) {
                try {
                    this.tableInfo.presItems = JSON.parse(localStorage.getItem('presItems'));
                    // console.log(this.events)
                } catch(e) {
                    localStorage.removeItem('presItems');
                }
            }
        },
        validateForm({pres, qty, usage}){
            let index = this.tableInfo.presItems.findIndex(x => x.name === pres.name)
            if(index === -1)
            {
                this.tableInfo.presItems.push({
                name: pres.name,
                man: pres.man,
                date: this.toIsoString(new Date()).substring(0, 10),
                qty: qty,
                usg: usage,
            })
            const parsedArray = JSON.stringify(this.tableInfo.presItems);
            localStorage.setItem('presItems', parsedArray);
            }
        },
        removePres(item){
            let index = this.tableInfo.presItems.findIndex(x => x.name === item.name)
            this.tableInfo.presItems.splice(index, 1)
            const parsedArray = JSON.stringify(this.tableInfo.presItems);
            localStorage.setItem('presItems', parsedArray);
        },
        removeSymptom(item){
            let index = this.tableInfo.symptomItems.findIndex(x => x.name === item.name)
            this.tableInfo.symptomItems.splice(index, 1)
            const parsedArray = JSON.stringify(this.tableInfo.symptomItems);
            localStorage.setItem('symptomItems', parsedArray);
        },
        removeTest(item){
            let index = this.tableInfo.testItems.findIndex(x => x.name === item.name)
            this.tableInfo.testItems.splice(index, 1)
            const parsedArray = JSON.stringify(this.tableInfo.testItems);
            localStorage.setItem('testItems', parsedArray);
        },
        addTest(item) {
            let temp = item.filter(x => (!this.tableInfo.testItems.some(y => y.name === x)))
            let temp2 = temp.map(x => ({name: x, date: this.toIsoString(new Date()).substring(0, 10), lab: this.lists.labsList[this.rnd(0, this.lists.labsList.length - 1)], status: 'Assigned'}))
            temp2.forEach(x => this.tableInfo.testItems.push(x))
            const parsedArray = JSON.stringify(this.tableInfo.testItems);
            localStorage.setItem('testItems', parsedArray);
        },
        symptomAdd(item){
            let temp = item.filter(x => (!this.tableInfo.symptomItems.some(y => y.name === x.name)))
            temp.forEach(x => this.tableInfo.symptomItems.push(x))
            const parsedArray = JSON.stringify(this.tableInfo.symptomItems);
            localStorage.setItem('symptomItems', parsedArray);
            
        },
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        getDetails(item){
            this.appointment.id = item.id
            this.appointment.pid= this.rnd(0, 100)
            this.appointment.name= item.doctor
            this.appointment.date= item.date
            this.appointment.age= this.rnd(0, 100)
            this.dialog = true
        },
        diagnosis({disease, details}){
            console.log(disease)
            console.log(details)

        }
    },
    mounted() {
        this.getItemsData()
    },
}
</script>

<style>

</style>