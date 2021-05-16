<template>
  <v-app>
    <v-container class="">
      <v-row>
        <v-col>
          <v-row>
            <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Inventory</h1>
          </v-row>
        </v-col>
      </v-row>
       <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          <template #buttons={item}>
            <v-btn @click="handleDialog(item)" class="font-weight-bold rounded-pill" outlined color="#5080DE">
              Order
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
    errorMsg: '',
    overlay: false,
    snackbar: false,
    valid: false,
    id: '', 
    name: '',
    qty: '',
    item:{},
    dialog: false,
    buttonHeader: 'buttons',
    headers: [
      { text: 'Name', align: 'start', value: 'name', class: 'datatablefontcolor--text' },
      { text: 'Manufacturer', value: 'man', class: 'datatablefontcolor--text' },
      { text: 'Stock', value: 'stock', class: 'datatablefontcolor--text' },
      { text: 'Actions', value: 'buttons', class: 'datatablefontcolor--text' },
    ],
    items:[],
    tableInfo: {
        tableTitle: 'Medicine Stock',
        itemsKey: 'name',
        itemsPerPage: 6,
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
      async validateForm(){
        this.$refs.form.validate()
        if (this.valid) {
          this.overlay = true
          await this.$http.post(this.$url + `/pharmacist/${this.id}/add_stock`, {
            stock: this.qty,
            name: this.lower(this.item.name)
          }).then(res => {
            console.log(res)
            this.getItems()
            this.errorMsg = `${this.qty} stock added to ${this.item.name}`
          }).catch(err => {
            console.log(err)
            this.errorMsg = 'Unknown error, try again later'
          }).finally(() => {
            this.snackbar = true
            this.overlay = false
            this.dialog = false
          })
        }
      },
      async getItems() {
        this.overlay = true
        await this.$http.get(this.$url + `/pharmacist/${this.id}/check_stock`).then(res => {
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
      }
  },
  created() {
      this.id = this.$cookies.get('user').national_id
      let temp = this.$cookies.get('user').name
      let temp1 = this.$cookies.get('user').surname
      this.name = this.capitalise(temp, temp1)
      this.getItems()
  }
}
</script>

<style>

</style>