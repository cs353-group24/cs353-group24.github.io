<template>
  <v-app>
    <v-container>
      <v-row class="fill-height">
        <v-col>
          <v-sheet height="64">
            <v-toolbar
              flat
            >
              <v-btn
                outlined
                class="mr-4"
                color="grey darken-2"
                @click="setToday"
              >
                Today
              </v-btn>
              <v-btn
                fab
                text
                small
                color="grey darken-2"
                @click="prev"
              >
                <v-icon small>
                  mdi-chevron-left
                </v-icon>
              </v-btn>
              <v-btn
                fab
                text
                small
                color="grey darken-2"
                @click="next"
              >
                <v-icon small>
                  mdi-chevron-right
                </v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <div>
                <span class="datatablefontcolor--text">
                  *click on date to schedule day off
                </span>
              </div>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="75vh">
            <v-dialog
              v-model="modal"
              width="25vw"
            >
              <v-card>
                <v-card-title class="headline">
                  Select as day off?
                </v-card-title>
                <v-card-text>Patients looking to make appointments will not be able to take appointments from you on this date!</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="red darken-1"
                    text
                    @click="modal = false"
                  >
                    No
                  </v-btn>
                  <v-btn
                    color="green darken-1"
                    text
                    @click="handleDayOff"
                  >
                    Yes
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-calendar
              ref="calendar"
              hide-header
              :event-height="25"
              v-model="focus"
              :events="events"
              :event-more="false"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @click:date="openModal"
              @change="updateRange"
            ></v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card
                color="grey lighten-4"
                min-width="350px"
                flat
              >
                <v-toolbar
                  :color="selectedEvent.color"
                  dark
                >
                  <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <div v-if="selectedEvent.name === 'Day Off'">
                    <v-btn color="error lighten-1" @click="removeDayOff" depressed>Remove</v-btn>
                  </div>
                </v-toolbar>
                <v-card-text class="datatablefontcolor--text text-subtitle-1" v-if="selectedEvent.name !== 'Day Off'">
                  <div v-for="(value, name) in selectedEvent.details" :key="value">
                    {{name.charAt(0).toUpperCase() + name.slice(1)}}: {{value}}
                  </div>
                </v-card-text>
                <v-card-actions v-if="selectedEvent.name !== 'Day Off'">
                  <v-btn
                    text
                    color="red"
                    @click="selectedOpen = false"
                  >
                    close
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="datatablefontcolor"
                    @click="getDetails(selectedEvent)"
                  >
                    View Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-row>
      <v-snackbar
        v-model="snackbar"
        :vertical="vertical"
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
    </v-container>
  </v-app>
</template>

<script>
import AppointmentDetails from "@/components/AppointmentDetails"
  export default {
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
          diseaseList: ['Malaria', 'HIV', 'Crabs', 'Chlamydia' ],
      },
      appointment: {
          id: '',
          pid: '',
          name: 'Mohi The Sicko',
          date: '',
          age: '',
      },
      errorMsg: '',
      snackbar:false,
      modal :false,
      selectedDay: '',
      doctor: 'Sunny',
      items: [],
      dateArray: [],
      focus: '',
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
    }),
    mounted () {
      this.$refs.calendar.checkChange()
      this.getItemsData()
    },
    methods: {
      openModal(event){
        this.selectedDay = event
        this.modal = true
      },
      handleDayOff(){
        if(!this.dateArray.includes(this.selectedDay.date))
        {
          this.dateArray.push(this.selectedDay.date)
          const newItem = {name: 'Day Off', start: this.selectedDay.date, color: 'green darken-1'}
          this.events.push(newItem)
          const parsedArray = JSON.stringify(this.dateArray);
          localStorage.setItem('dataArray', parsedArray);
        }
        else{
          if(this.events.some(e => (e.start === this.selectedDay.date)&&(e.name.includes('Appointment')))){
            this.errorMsg = `Cannot schedule the day off as an appointment has already been made for the date: ${this.selectedDay.date}`
            this.snackbar = true
          }
        }
        
        this.modal = false
      },
      removeDayOff(){
        console.log(this.selectedEvent.start)
        let index = this.dateArray.findIndex((x) => x === this.selectedEvent.start)
        this.dateArray.splice(index, 1)
        let findObj = (value) => {
          let temp = value.findIndex((x) => x.start === this.selectedEvent.start)
          return temp
        }
        index = findObj(this.events)
        this.events.splice(index, 1)
        const parsedArray = JSON.stringify(this.dateArray);
        localStorage.setItem('dataArray', parsedArray);
        this.selectedOpen = false
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange () {
        const temp = JSON.parse(JSON.stringify(this.events))
        this.events = temp
      },
      getItemsData(){
          if (localStorage.getItem('items')) {
              try {
                  let parse = JSON.parse(localStorage.getItem('items'));
                  this.items = parse.filter((x) => x.doctor === this.doctor)
                  this.events = this.items.map((x) => ({name: `Appointment ID: ${x.id}`, start: x.date, color:'datatablefontcolor', details: x}))
                  // console.log(this.events)
              } catch(e) {
                  localStorage.removeItem('items');
              }
              }
              if (localStorage.getItem('dataArray')) {
              try {
                  this.dateArray = JSON.parse(localStorage.getItem('dataArray'));
                  let temp = this.dateArray.filter((x) => {
                    if(!this.events.some(e => e.start === x)){
                      return x
                    }
                  })
                  temp.forEach((x)=>{
                    const newItem = {name: 'Day Off', start: x, color: 'green darken-1'}
                    this.events.push(newItem)
                  })
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
            this.appointment.id = item.details.id
            this.appointment.pid= this.rnd(0, 100)
            this.appointment.name= item.details.doctor
            this.appointment.date= item.details.date
            this.appointment.age= this.rnd(0, 100)
            this.dialog = true
        },
        diagnosis(disease, details){
            console.log(disease)
            console.log(details)

        }
    },
    components: {AppointmentDetails}
  }
</script>

<style>

</style>