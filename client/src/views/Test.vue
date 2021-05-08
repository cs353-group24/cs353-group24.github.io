<template>
  <v-main class="pa-16">
        <PaginationTable :items="items" :headers="headers" :tableInfo="tableInfo" :buttonHeader="buttonHeader">
          <template #buttons="{item}">
            <v-row>
             <v-col class="d-flex justify-start mr-n2">
                <v-btn @click.stop="handleDialog1(item)" large class="rounded-pill font-weight-bold" outlined color="#5080DE">Dialog 1</v-btn>
            </v-col>
            <v-col class="d-flex justify-start ml-n16">
                <v-btn @click.stop="handleDialog2(item)" large class="rounded-pill font-weight-bold" outlined color="#5080DE">Dialog 2</v-btn>
            </v-col>
            </v-row>
          </template>
        </PaginationTable>
        <Dialog :tableData="group" :item="item" :dialog="dialog" :dialogMode="'cols'" :title="'Symptoms'" @close="dialog=false">
            <template #tableActions>
                <v-btn class="rounded-pill font-weight-bold" outlined color="#5080DE">Dummy</v-btn>
            </template>
        </Dialog>
        <Dialog :tableData="group" :dialog="dialog2" :title="'Component: Urea'" :subtitle="'Expected Interval: 16.6- 48.5'" @close="dialog2=false">
          <template #tableActions class="datatablecolor">
            <v-btn class="rounded-pill font-weight-bold" outlined color="#5080DE">Dummy</v-btn>
          </template>
        </Dialog>
  </v-main>
</template>

<script>
import PaginationTable from "@/components/PaginationTable";
import Dialog from "@/components/Dialog";
export default {
    data() {
        return{
            group: {
                items:'',
                headers:'',
                tableInfo:'',
                buttonHeader: ''
            },
            item: {},
            item2: {},
            dialog: false,
            dialog2: false,
            buttonHeader: 'actions',
            headers: [
            {
                text: 'Dessert (100g serving)',
                align: 'start',
                sortable: false,
                // filterable: false,
                value: 'name',
                class: 'datatablefontcolor--text'
            },
            { text: 'Calories', value: 'calories', class: 'datatablefontcolor--text'},
            { text: 'Fat (g)', value: 'fat', class: 'datatablefontcolor--text'},
            { text: 'Carbs (g)', value: 'carbs', class: 'datatablefontcolor--text'},
            { text: 'Protein (g)', value: 'protein', class: 'datatablefontcolor--text'},
            { text: 'Iron (%)', value: 'iron', class: 'datatablefontcolor--text'},
            { text: 'Actions', value: 'actions', sortable: false, class: 'datatablefontcolor--text'},
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
                itemsPerPage: 6,
            },
            // color: [{ //can be used to pass colors to coloumns based on computations
            //     name: 'calories',
            //     color: ''
            // },]
        };
    },
    components:{
        PaginationTable, Dialog
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
        handleDialog1: function(item){
            // console.log(this.group);
            this.item = item;
            this.dialog = true;
        },
        handleDialog2: function(item){
            this.item2 = item;
            this.dialog2 = true;
        },
    },
    created: function() {
        this.group.items = this.items
        this.group.headers = this.headers
        this.group.tableInfo = this.tableInfo
        this.group.buttonHeader = this.buttonHeader
    }
}
</script>
