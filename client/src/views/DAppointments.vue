<template>
  <v-app>
    <v-container class="">
      <v-row>
        <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Past Appointments</h1>
      </v-row>
      <PaginationTable :items="items" :headers="headers" :tableInfo="doctortableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons="{item}">
            <v-row>
            <v-col class="d-flex justify-center mx-n5">
                <v-col class="d-flex justify-center mx-n7">
                    <v-btn @click="getDetails(item)" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">View Details</v-btn>
                </v-col>
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
            @close="dialog=false"
        >
        </AppointmentDetails>
    </v-container>
  </v-app>
</template>

<script>
import AppointmentDetails from "@/components/AppointmentDetails"
import PaginationTable from "@/components/PaginationTable";
export default {
  components: {
    PaginationTable, AppointmentDetails
  },

  data: () => ({
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
    },
    appointment: {
        id: '',
        pid: '',
        name: 'Mohi The Sicko',
        date: '',
        age: '',
    },
    group: {
        items:'',
        headers:'',
        tableInfo:'',
        buttonHeader: ''
    },
    dialog1: false,
    dialog2: false,
    dialog3: false,
    buttonHeader: 'details',
    headers: [
    {
        text: 'Appointment ID',
        align: 'start',
        sortable: false,
        // filterable: false,
        value: 'name',
        class: 'datatablefontcolor--text'
    },
    { text: 'Doctor Name', value: 'calories', class: 'datatablefontcolor--text' },
    { text: 'Date', value: 'fat', class: 'datatablefontcolor--text' },
    { text: 'Time', value: 'carbs', class: 'datatablefontcolor--text' },
    { text: 'Department', value: 'protein', class: 'datatablefontcolor--text' },
    { text: 'Iron', value: 'iron', class: 'datatablefontcolor--text' },
    { text: 'Details', value: 'details', sortable:false, class: 'datatablefontcolor--text' },
    ],
    items: [
    {
        name: 1010,
        calories: 'Dr Mohla',
        fat: 6.0,
        carbs: 24,
        protein: 4.0,
        iron: '1%',
    },
    {
        name: 1100,
        calories: 'Dr Royim',
        fat: 9.0,
        carbs: 37,
        protein: 4.3,
        iron: '1%',
    },
    {
        name: 1141,
        calories: 262,
        fat: 16.0,
        carbs: 23,
        protein: 6.0,
        iron: '7%',
    },
    
    ],
    doctortableInfo: {
        tableTitle: 'Past Appointments',
        itemsKey: 'name',
        itemsPerPage: 6,
    },
  }),
  methods: {
      getItemsData(){
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
        this.appointment.name= item.calories
        this.appointment.date= item.fat
        this.appointment.age= this.rnd(0, 100)
        this.dialog = true
    },
  },
  created: function() {
      this.group.items = this.items
      this.group.headers = this.headers
      this.group.tableInfo = this.tableInfo
      this.group.buttonHeader = this.buttonHeader
  },
  mounted(){
    this.getItemsData()
  }
};
</script>

<style scoped>

</style>