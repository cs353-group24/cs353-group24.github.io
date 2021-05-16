<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-col>
          <v-row class="d-flex">
              <v-col cols="3"><h1 class="ml-5 mt-10 mb-n10 pt-5 datatablefontcolor--text">Stock Info</h1></v-col>
              <v-col class="mb-n16 mt-16 pt-5 ml-14">
                  <v-radio-group
                    v-model="row"
                    row
                    class="d=flex justify-end align-end pt-8 ml-16 pl-16"
                    >
                    <v-radio
                        label="Search by Name"
                        value="name"
                    ></v-radio>
                    <v-radio
                        label="Search by stock not in range"
                        value="stock"
                    ></v-radio>
                    </v-radio-group>
              </v-col>
            </v-row>
        </v-col>
      </v-row>
      <v-row class="mx-2 mt-10 mb-n10" v-if="row === 'name'">
          <v-col >
              <v-text-field
                outlined
                v-model="medName"
                clearable
                :rules="[v => !!v || 'Medicine is required']"
                label="Search for Medicine"
                required
                ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn @click="searchMed" :disabled="(!!medName ? false : true)" large color="#558EFE" width="100%" height="63%" class="white--text rounded-lg font-weight-bold mr-5 mb-5">
                Search
            </v-btn>
          </v-col>
      </v-row>
      <v-row class="mx-2 mt-10 mb-n10" v-if="row === 'stock'">
          <v-col >
              <v-text-field
                outlined
                v-model="lower_bound"
                clearable
                label="Lower range"
                required
                ></v-text-field>
          </v-col>
          <v-col >
              <v-text-field
                outlined
                v-model="upper"
                clearable
                label="Upper range"
                required
                ></v-text-field>
          </v-col>
          <v-col cols="2">
            <v-btn @click="searchStock" :disabled="((!!lower_bound && !!upper) ? false : true)" large color="#558EFE" width="100%" height="63%" class="white--text rounded-lg font-weight-bold mr-5 mb-5">
                Search
            </v-btn>
          </v-col>
      </v-row>
       <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons={item}>
            <v-btn v-if="item.stock < lower_bound" @click="handleDialog(item)" class="font-weight-bold rounded-pill" outlined color="#5080DE">
              Order Stock
            </v-btn>
            <v-btn v-if="item.stock > upper" @click="handleDialog1(item)" class="font-weight-bold rounded-pill" outlined color="#5080DE">
              Dump Stock
            </v-btn>
          </template>
      </PaginationTable>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="30vw"
      >
        <v-card>
          <v-card-title class="headline datatablefontcolor--text text-center">
            Order {{item.name}}
          </v-card-title>
          <v-card-text class="mt-4">
            <!-- maybe use cached items prop -->
            <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="qty"
              clearable
              :rules="[v => /^\d+$/.test(v) || 'Numbers only']"
              prepend-inner-icon="mdi-pill"
              :items="items"
              label="Quantity to Order"
              outlined
            ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="datatablefontcolor"
              text
              @click="dialog=false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="datatablefontcolor"
              text
              @click="validateForm"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialog1"
        persistent
        max-width="30vw"
      >
        <v-card>
          <v-card-title class="headline datatablefontcolor--text text-center">
            Order {{item.name}}
          </v-card-title>
          <v-card-text class="mt-4">
            <!-- maybe use cached items prop -->
            <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="qty"
              clearable
              :rules="[v => /^\d+$/.test(v) || 'Numbers only']"
              prepend-inner-icon="mdi-pill"
              :items="items"
              label="Quantity to Dump"
              outlined
            ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="datatablefontcolor"
              text
              @click="dialog1=false"
            >
              Cancel
            </v-btn>
            <v-btn
              color="datatablefontcolor"
              text
              @click="validateForm1"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
  components:{PaginationTable},
  data: ()=>({
    lower_bound: '',
    upper: '',
    row: 'name',
    errorMsg: '',
    medName: '',
    overlay: false,
    snackbar: false,
    valid: false,
    id: '', 
    name: '',
    qty: '',
    item:{},
    dialog: false,
    dialog1: false,
    buttonHeader: 'buttons',
    headers: [
      { text: 'Name', align: 'start', value: 'name', class: 'datatablefontcolor--text' },
      { text: 'Manufacturer', value: 'man', class: 'datatablefontcolor--text' },
      { text: 'Stock', value: 'stock', class: 'datatablefontcolor--text' },
      { text: 'Actions', value: 'buttons', class: 'datatablefontcolor--text' },
    ],
    items:[],
    tableInfo: {
        tableTitle: 'Search Results',
        itemsKey: 'name',
        itemsPerPage: 4,
    },
  }),
  methods: {
      handleDialog(item){
          if(this.$refs.form){
            this.$refs.form.resetValidation()
          }
          this.qty=''
          this.item = item;
          this.dialog = true;
      },
      handleDialog1(item){
          if(this.$refs.form){
            this.$refs.form.resetValidation()
          }
          this.qty=''
          this.item = item;
          this.dialog1 = true;
      },
      async validateForm(){
        this.$refs.form.validate()
        if (this.valid) {
          this.overlay = true
          await this.$http.post(this.$url + `/pharmacist/${this.id}/add_stock`, {
            stock: this.qty,
            name: this.lower(this.item.name)
          }).then(res => {
            console.log(res)
            if (this.row === 'name') {
                this.searchMed()
            }
            else{
                this.searchStock()
            }
            this.errorMsg = `${this.qty} stock added to ${this.item.name}`
          }).catch(err => {
            console.log(err)
            this.errorMsg = 'Unknown error, try again later'
          }).finally(() => {
            this.snackbar = true
            this.medName = ''
            this.overlay = false
            this.dialog = false
          })
        }
      },
      async validateForm1(){
        this.$refs.form.validate()
        if (this.valid) {
          this.overlay = true
          await this.$http.post(this.$url + `/pharmacist/${this.id}/delete_stock`, {
            stock: this.qty,
            name: this.lower(this.item.name)
          }).then(res => {
            console.log(res)
            this.searchStock()
            this.errorMsg = `${this.qty} stock dumped from ${this.item.name}`
          }).catch(err => {
            console.log(err)
            this.errorMsg = 'Unknown error, try again later'
          }).finally(() => {
            this.snackbar = true
            this.medName = ''
            this.overlay = false
            this.dialog1 = false
          })
        }
      },
      async searchMed(){
          this.overlay = true
          await this.$http.get(this.$url + `/pharmacist/${this.id}/medicine_search`, {
              params:{
                  name: this.medName
              }
          }).then(res => {
              console.log(res)
              this.items = []
              res.data.forEach(x => {
                  this.items.push({
                        name: this.capitalise(x.name),
                        man: this.capitalise(x.manufacturer),
                        stock: x.stock
                    })
              })
          }).catch(err => {
              console.log(err)
              this.errorMsg = 'Unknown error, try again later'
                this.snackbar = true
          }).finally(() => {
              this.overlay = false
          })
      },
      async searchStock() {
          this.overlay = true
          await this.$http.get(this.$url + `/pharmacist/${this.id}/stock_search`, {
              params: {
                  lower_bound: this.lower_bound,
                  upper_bound: this.upper
              }
          }).then(res => {
              console.log(res)
              this.items = []
              res.data.forEach(x => {
                  this.items.push({
                        name: this.capitalise(x.name),
                        man: this.capitalise(x.manufacturer),
                        stock: x.stock
                    })
              })
          }).catch(err => {
              console.log(err)
              this.errorMsg = 'Unknown error, try again later'
            this.snackbar = true
          }).finally(() => {
              this.overlay = false
          })
      },
  },
  created() {
      this.id = this.$cookies.get('user').national_id
      let temp = this.$cookies.get('user').name
      let temp1 = this.$cookies.get('user').surname
      this.name = this.capitalise(temp, temp1)
  }
}
</script>

<style>

</style>