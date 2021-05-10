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
                    @click="selectedOpen = false"
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
    </v-container>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
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
      },
    },
  }
</script>

<style>

</style>