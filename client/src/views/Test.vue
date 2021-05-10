<template>
    <v-app>
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
    </v-app>
</template>

<script>
import AppointmentDetails from "@/components/AppointmentDetails"
export default {
    data: () => ({
        dialog:false,
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
            id: 10,
            pid: 435,
            name: 'Mohi The Sicko',
            date: '',
            age: 43,
        },
    }),
    components:{
        AppointmentDetails
    },
    created(){
        this.appointment.date = this.toIsoString(new Date()).substring(0, 10)
    },
    methods:{
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
        getData(){
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
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
    },
    mounted () {
      this.getData()
    },
}
</script>

<style>

</style>