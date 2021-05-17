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
      <AppointmentDetails :appointment="appointment" :tableInfo="tableInfo" :model="dialog" :diag="diagDesc"
            @symptomAdd="symptomAdd"
            @viewResult="viewResult($event)"
            @testAdd="addTest"
            @validateForm="validateForm"
            @diagnosis="diagnosis"
            @close="dialog=false"
            @overlay="overlay=!overlay"
            @snackbar="snackbar=!snackbar"
            @err="errorMsg=$event"
        >
        </AppointmentDetails>
        <Dialog :tableData="group" :dialog="dialog1" :title="!!item? `Result: ${item.resultID} - ${item.name}`: ` `" @close="dialog1=false;dialog=true"></Dialog>
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
import AppointmentDetails from "@/components/AppointmentDetails"
import Dialog from "@/components/Dialog"
  export default {
    data: () => ({
      item: null,
      dialog1:false,
      group: {
        items:[],
        headers: [
        { text: 'Component Name', value: 'name', class: 'datatablefontcolor--text' },
        { text: 'Lower-Normality-Interval', value: 'l_interval', class: 'datatablefontcolor--text' },
        { text: 'Upper-Normality-Interval', value: 'u_interval', class: 'datatablefontcolor--text' },
        { text: 'Value', value: 'value', class: 'datatablefontcolor--text' },
        { text: 'Result', value: 'result', class: 'datatablefontcolor--text' },
        { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },
        ],
        tableInfo:{
            tableTitle: 'Test Component Results',
            itemsKey: 'name',
            itemsPerPage: 6,
        },
        buttonHeader: 'details'
      },
      appointment: {
        id: '',
        name: '',
        date: '',
        status: ''
      },
      snackbar: false,
      overlay: false,
      errorMsg: '',
      id:'',
      dialog: false,
      tableInfo: {
          symptomItems: [],
          presItems: [],
          testItems: [],
          diagItems: []
      },
      dateArray:[],
      diagDesc: '',
      modal :false,
      selectedDay: '',
      focus: '',
      type: 'month',
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
    }),
    mounted () {
      this.$refs.calendar.checkChange()
      this.id = this.$cookies.get('user').national_id
      let temp = this.$cookies.get('user').name
      let temp1 = this.$cookies.get('user').surname
      this.doctor = this.capitalise(temp, temp1)
      this.getItemsData()
    },
    methods: {
      openModal(event){
        this.selectedDay = event
        this.modal = true
      },
      async handleDayOff(){
        if(!this.dateArray.includes(this.selectedDay.date))
        {
          this.overlay = true
          await this.$http.post(this.$url +  `/doctor/${this.id}/create_off_days`, {
            date: this.selectedDay.date
          }).then(res => {
            console.log(res)
            this.errorMsg = 'Day off added'
          }).catch(err => {
            console.log(err)
            this.errorMsg = 'Unknown error, try again later'
          }).finally(() => {
            this.overlay = false
            this.snackbar = true
          })
          this.getItemsData()
          // const newItem = {name: 'Day Off', start: this.selectedDay.date, color: 'green darken-1'}
          // this.events.push(newItem)
        }
        else{
          if(this.events.some(e => (e.start === this.selectedDay.date)&&(e.name.includes('Appointment')))){
            this.errorMsg = `Cannot schedule the day off as an appointment has already been made for the date: ${this.selectedDay.date}`
            this.snackbar = true
          }
        }
        
        this.modal = false
      },
      async removeDayOff(){
        // console.log(this.selectedEvent.start)
        this.overlay = true
        await this.$http.post(this.$url +  `/doctor/${this.id}/delete_off_days`, {
          date: this.selectedEvent.start
        }).then(res => {
          console.log(res)
          this.errorMsg = 'Day off removed'
        }).catch(err => {
          console.log(err)
          this.errorMsg = 'Unknown error, try again later'
        }).finally(() => {
          this.overlay = false
          this.snackbar = true
        })
        this.getItemsData()
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
      async viewResult(item) {
          this.item = item
          this.overlay = true
          await this.$http.get(this.$url + `/doctor/${this.id}/${this.appointment.id}/see_test_components`, {
            params: {
              result_id: item.resultID
            }
          }).then(res=>{
            console.log(res)
            this.group.items=[]
            res.data.forEach(x=>{
              this.group.items.push({
                name: x.comp_name,
                status: x.comp_status,
                result: (x.comp_result === null? '-': x.comp_result),
                value: x.comp_value,
                u_interval: x.upper_normality_interval,
                l_interval: x.lower_normality_interval,
              })
            })
            this.dialog1 =true
            this.dialog = false
          }).catch(err=>{
            console.log(err)
            this.errorMsg = 'Unexpected Error, could not load data'
            this.overlay = false
            this.snackbar = true
          }).finally(()=>{
            this.overlay=false
          })
        },
        async getItemsData(){
          this.overlay = true
          await this.$http.get(this.$url+`/doctor/${this.id}/homepage`).then(res => {
            console.log(res)
            this.events = []
            res.data.forEach(x => {
              let temp = {
                  name: "Appointment: " + String(x.appointment_id),
                  start: x.date,
                  color: 'datatablefontcolor',
                  details: x
                }
                this.events.push(temp)
            })
            this.overlay = false
          }).catch((err) => {
            console.log(err)
            this.errorMsg = 'Unexpected Error, could not load data'
            this.overlay = false
            this.snackbar = true
          })
          await this.getDate()
          this.dateArray.forEach(x =>{
            if(!this.events.some(y => y.start === x))
            {
              this.events.push({name: 'Day Off', start: x, color: 'green darken-1'})
            }
          })
        },
        async getDate(){
          this.overlay = true
          await this.$http.get(this.$url+`/doctor/${this.id}/off_days`).then(res => {
            console.log(res)
            this.dateArray = []
            res.data.forEach(x => {
              this.dateArray.push(x.date_to_char)
            })
            this.overlay = false
          }).catch((err) => {
            console.log(err)
            this.errorMsg = 'Unexpected Error, could not load data'
            this.overlay = false
            this.snackbar = true
          })
          // console.log(this.dateArray)
        },
        async validateForm(){
            this.overlay = true
            await this.$http.get(this.$url+`/doctor/${this.id}/get_presc_medicine`,{
              params:{
                prescription_no: this.appointment.id
              }
            }).then(res => {
              this.tableInfo.presItems=[]
              console.log(res)
              res.data.forEach(x => {
                this.tableInfo.presItems.push({
                  name: x.med_name,
                  man: x.manufacturer,
                  date: this.appointment.date,
                  qty: x.qty,
                  usg: x.usage_method
                })
              })
            }).catch(err => {
              console.log(err)
              this.errorMsg = 'Unexpected Error, could not load data'
              this.snackbar = true
            }).finally(()=>{
              this.overlay = false
            })
        },
        async addTest() {
          this.overlay = true
            await this.$http.get(this.$url+`/doctor/${this.id}/${this.appointment.id}/see_tests`).then(res => {
              console.log(res)
              this.tableInfo.testItems=[]
              res.data.forEach(x => {
                this.tableInfo.testItems.push({
                  name: x.test_name,
                  date: x.date_to_char,
                  lab: this.capitalise(x.name, x.surname),
                  status: x.test_status,
                  resultID: x.result_id
                })
              })
            }).catch(err => {
              console.log(err.response)
              this.errorMsg = 'Unexpected Error, could not load data'
              this.snackbar = true
            }).finally(()=>{
              this.overlay = false
            })
        },
        async symptomAdd(){
            this.overlay = true
            await this.$http.get(this.$url+`/doctor/${this.id}/${this.appointment.id}/see_patient_symptoms`).then(res => {
              // console.log(res)
              this.tableInfo.symptomItems=[]
              res.data.forEach(x => {
                this.tableInfo.symptomItems.push({
                  name: x.symptom_name,
                  details: x.description
                })
              })
            }).catch(err => {
              console.log(err.response)
              this.errorMsg = 'Unexpected Error, could not load data'
              this.snackbar = true
            }).finally(()=>{
              this.overlay = false
            })
            
        },
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        async getDiag(){
            this.overlay = true
            await this.$http.get(this.$url + `/doctor/${this.id}/${this.appointment.id}/see_diagnosis`).then(res => {
                console.log(res)
                this.tableInfo.diagItems= []
                res.data.forEach(x => {
                    this.tableInfo.diagItems.push({
                        name: x.disease_name,
                        desc: x.description
                    })
                })
            }).catch(err => {
                console.log(err.response)
                this.errorMsg = 'Unexpected Error, could not load data'
                this.snackbar = true
            }).finally(() => {
            })
            await this.$http.get(this.$url + `/doctor/${this.id}/${this.appointment.id}/see_diagnosis_desc`).then(res => {
                // console.log(res)
                this.diagDesc = res.data[0].description
            }).catch(err => {
                console.log(err.response)
                this.errorMsg = 'Unexpected Error, could not load data'
                this.snackbar = true
            }).finally(() => {
                this.overlay = false
            })
        },
        async getDetails(item){
          this.overlay = true
          this.appointment.id = item.details.appointment_id
          this.appointment.name= this.capitalise(item.details.name, item.details.surname)
          this.appointment.date= item.details.date
          this.appointment.status= item.details.status
          this.tableInfo.symptomItems = [];
          this.tableInfo.testItems = [];
          this.tableInfo.presItems = [];
          
          this.symptomAdd()
          this.addTest()
          this.checkPres()
          this.validateForm()
          this.getDiag()
          this.dialog=true
        },
        async diagnosis(){
          this.overlay = true
          await this.$http.post(this.$url + `/patient/${this.id}/appointment/status`, {
            appointment_id: this.appointment.id
          }).then(res => {
            console.log(res)
            this.errorMsg = 'Appointment is finalized now'
          }).catch(err => {
            console.log(err)
            this.errorMsg = 'Unexpected Error, could not load data'
          }).finally(() => {
            this.snackbar = true
            this.overlay = false
          })
          this.getItemsData()
        },
        async checkPres(){
            this.overlay = true
            await this.$http.get(this.$url+`/doctor/${this.id}/get_prescription`, {
                params: {
                    appointment_id: this.appointment.id
                }
            }).then(res=>{
                console.log(res)
                if(res.data.length === 0){
                  this.$http.post(this.$url+`/doctor/${this.id}/add_prescription`, {
                    appointment_id: this.appointment.id
                  }).then(res => {
                    console.log(res)
                  }).catch(err => {
                    console.log(err.response)
                  })
                }
            }).catch(err=>{
                console.log(err)
            })
            this.overlay = false
        }
    },
    components: {AppointmentDetails, Dialog}
  }
</script>

<style>

</style>