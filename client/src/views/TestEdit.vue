<template>
  <v-app>
    <v-container>
      <v-col>
        <v-row>
          <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Test - {{this.$route.params.id}}</h1>
        </v-row>
      </v-col>
      <v-col class="d-flex justify-end mt-16 pt-5">
        <v-dialog
            v-model="editScreen"
            persistent
            max-width="30vw"
        >
          <v-card>
            <v-card-title class="headline datatablefontcolor--text text-center">
              Edit
            </v-card-title>
            <v-card-text class="mt-4">
              <!-- maybe use cached items prop -->
              <v-form ref="form" v-model="valid">
                <v-select
                    v-model="changedComponent"
                    autofocus
                    clearable
                    :rules="[v => !!v || 'Component is required']"
                    :items="components"
                    label="Component"
                    outlined
                ></v-select>
                <v-select
                    v-model="assignedValue"
                    :disabled="(!!changedComponent) ? false: true"
                    clearable
                    :rules="[v => !!v || 'Value is required']"
                    :items="componentValues"
                    label="Value"
                    outlined
                ></v-select>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                  color="datatablefontcolor"
                  text
                  @click="editScreen=false"
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
      </v-col>
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo"  style="margin-top:1.5rem" class="mx-2"></PaginationTable>
    </v-container>
    <v-row>
      <v-col class="d-flex justify-center mx-n8">
        <v-btn @click="editComponents()" class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Edit</v-btn>
      </v-col>
      <v-col class="d-flex justify-center mx-n8">
        <v-btn  class="rounded-lg font-weight-bold rounded-pill" outlined color="#5080DE">Submit</v-btn>
      </v-col>
    </v-row>
  </v-app>
</template>

<script>
import PaginationTable from "@/components/PaginationTable";
//import $route from "express/lib/router/layer";
export default {
  name: "TestEdit",
  components:{
    PaginationTable
  },
  data: () => ({
    editScreen: false,
    changedComponent: '',
    assignedValue:'',
    headers: [
      { text: 'Component', align: 'start',  value: 'component', class: 'datatablefontcolor--text'},
      { text: 'Result ID', align: 'start',  value: 'resultID', class: 'datatablefontcolor--text'},
      { text: 'Lower Interval', align: 'start',  value: 'l_interval', class: 'datatablefontcolor--text'},
      { text: 'Upper Interval', align: 'start',  value: 'h_interval', class: 'datatablefontcolor--text'},
      { text: 'Value', align: 'start',  value: 'value', class: 'datatablefontcolor--text'},
      { text: 'Result', align: 'start',  value: 'result', class: 'datatablefontcolor--text'},
    ],
    tableInfo: {
      tableTitle: 'Tests',
      itemsKey: 'id',
      itemsPerPage: 6,
    },
    items:[
      {
        component: 'Creatin Kinase',
        resultID: 6745,
        l_interval: 0,
        h_interval: 190,
        value: 83,
        result: 'normal'
      },
      {
        component: 'Creatin Kinase',
        resultID: 6745,
        l_interval: 0,
        h_interval: 190,
        value: '-',
        result: '-'
      }
    ],
    componentValues: [],
    components: []
  }),
  methods:{
    editComponents: function (){
      this.editScreen = true;
    },
    validateForm: function (){
      this.$refs.form.validate()

    }
  },
  created() {
    console.log(this.$route.params.id)
  }
}
</script>

<style scoped>

</style>