<template>
  <v-app>
    <v-container class="">
      <v-row>
        <h1 class="ml-5 mt-10 pt-5 datatablefontcolor--text">Welcome {{patientName}}</h1>
      </v-row>
      <v-row>
        <h4 class="ml-6 blue--text text--lighten-3">You have {{upcoming}} upcoming appointments</h4>
      </v-row>
       <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader" style="margin-top:1.5rem" class="mx-2">
          
      </PaginationTable>
    </v-container>
  </v-app>
</template>

<script>
import PaginationTable from "@/components/PaginationTable";
export default {
  components: {
    PaginationTable
  },

  data: () => ({
    patientName: 'Abdul',
    upcoming: 5,
    buttonHeader: 'actions',
    headers: [
    {
        text: 'Appointment ID',
        align: 'start',
        // sortable: false,
        // filterable: false,
        value: 'name',
        class: 'datatablefontcolor--text'
    },
    { text: 'Doctor Name', value: 'calories', class: 'datatablefontcolor--text' },
    { text: 'Date', value: 'fat', class: 'datatablefontcolor--text' },
    { text: 'Time', value: 'carbs', class: 'datatablefontcolor--text' },
    { text: 'Department', value: 'protein', class: 'datatablefontcolor--text' },
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
    tableInfo: {
        tableTitle: 'Upcoming',
        itemsKey: 'name',
        itemsPerPage: 6,
    },
  }),
};
</script>

<style scoped>

</style>