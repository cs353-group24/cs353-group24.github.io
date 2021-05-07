<template>
  <v-main class="pa-16">
      <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader">
          <template #buttons="{item}">
            <v-row>
            <v-col class="d-flex justify-center">
                <v-btn @click="console(item.name)" width="100%" height="100%" color="#558EFE" class="white--text rounded-lg font-weight-bold">Name</v-btn>
            </v-col>
            <v-col class="d-flex justify-center">
                <v-btn @click="console(item.calories)" width="100%" large class="rounded-lg font-weight-bold" outlined color="#5080DE">Calories</v-btn>
            </v-col>
            </v-row>
          </template>
      </PaginationTable>
  </v-main>
</template>

<script>
import PaginationTable from "@/components/PaginationTable";
export default {
    data() {
        return{
            buttonHeader: 'actions',
            headers: [
            {
                text: 'Dessert (100g serving)',
                align: 'start',
                sortable: false,
                // filterable: false,
                value: 'name',
            },
            { text: 'Calories', value: 'calories' },
            { text: 'Fat (g)', value: 'fat' },
            { text: 'Carbs (g)', value: 'carbs' },
            { text: 'Protein (g)', value: 'protein' },
            { text: 'Iron (%)', value: 'iron' },
            { text: 'Actions', value: 'actions', sortable: false },
            ],
            items: [
            {
                name: 'Frozen Yogurt',
                calories: 159,
                fat: 6.0,
                carbs: 24,
                protein: 4.0,
                iron: '1%',
            },
            {
                name: 'Ice cream sandwich',
                calories: 237,
                fat: 9.0,
                carbs: 37,
                protein: 4.3,
                iron: '1%',
            },
            {
                name: 'Eclair',
                calories: 262,
                fat: 16.0,
                carbs: 23,
                protein: 6.0,
                iron: '7%',
            },
            {
                name: 'Cupcake',
                calories: 305,
                fat: 3.7,
                carbs: 67,
                protein: 4.3,
                iron: '8%',
            },
            {
                name: 'Gingerbread',
                calories: 356,
                fat: 16.0,
                carbs: 49,
                protein: 3.9,
                iron: '16%',
            },
            {
                name: 'Jelly bean',
                calories: 375,
                fat: 0.0,
                carbs: 94,
                protein: 0.0,
                iron: '0%',
            },
            {
                name: 'Lollipop',
                calories: 392,
                fat: 0.2,
                carbs: 98,
                protein: 0,
                iron: '2%',
            },
            {
                name: 'Honeycomb',
                calories: 408,
                fat: 3.2,
                carbs: 87,
                protein: 6.5,
                iron: '45%',
            },
            {
                name: 'Donut',
                calories: 452,
                fat: 25.0,
                carbs: 51,
                protein: 4.9,
                iron: '22%',
            },
            {
                name: 'KitKat',
                calories: 518,
                fat: 26.0,
                carbs: 65,
                protein: 7,
                iron: '6%',
            },
            ],
            tableInfo: {
                tableTitle: 'My Paginator',
                itemsKey: 'name',
                itemsPerPage: 5,
            },
            // color: [{ //can be used to pass colors to coloumns based on computations
            //     name: 'calories',
            //     color: ''
            // },]
        };
    },
    components:{
        PaginationTable,
    },
    methods: {
        console: function(value) {
            console.log(value);
        },
        // getColor: function(value){
        //     if (value > 400) this.color.color = 'red'
        //     else if (value > 200) this.color.color = 'orange'
        //     else this.color.color = 'green'
        // }
    }
}
</script>
