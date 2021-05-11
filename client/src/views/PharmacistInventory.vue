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
       <PaginationTable :items="presItems" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
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
              :items="presItems"
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
    </v-container>
  </v-app>
</template>

<script>
import PaginationTable from "@/components/PaginationTable"
export default {
  components:{PaginationTable},
  data: ()=>({
    valid: false,
    qty: '',
    item:{},
    dialog: false,
    buttonHeader: 'buttons',
    headers: [
      { text: 'Prescription ID', align: 'start', value: 'name', class: 'datatablefontcolor--text' },
      { text: 'Appointment ID', value: 'man', class: 'datatablefontcolor--text' },
      { text: 'Actions', value: 'buttons', class: 'datatablefontcolor--text' },
    ],
    presItems:[],
    tableInfo: {
        tableTitle: 'Waiting Prescriptions',
        itemsKey: 'presid',
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
      prescribe(item){
        // this function will deduct item.qty from the medicine(item.name) stock left
        // will also have a check, if qty of medicine is less than order qty, this.snackbar=true
        this.snackbar = true
        console.log(item)
      },
      validateForm(){
        this.$refs.form.validate()
        if (this.valid) {
          console.log(`${this.qty} order for ${this.item.name}`)
        }
      }
  },
  created() {
      if (localStorage.getItem('presItems')) {
          try {
              this.presItems = JSON.parse(localStorage.getItem('presItems'));
              // console.log(this.events)
          } catch(e) {
              localStorage.removeItem('presItems');
          }
      }
  }
}
</script>

<style>

</style>