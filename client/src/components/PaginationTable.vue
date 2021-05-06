<template>
      <v-card>
        <v-card-title>
        {{tableInfo.tableTitle}}
        <v-spacer></v-spacer>
        <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
        ></v-text-field>
        </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :item-key="tableInfo.itemsKey"
        :items-per-page="tableInfo.itemsPerPage"
        class="elevation-1"
        :page.sync="page"
        :search="search"
        :hide-default-footer="true"
        :loading="(items.length === 0)? true:false"
        loading-text="Loading... Please wait"
        @page-count="pageCount = $event"
      >
        <!-- :custom-filter="filterOnlyCapsText" can be used to implement a filter if needed, check data-table in vuetify -->
        <!-- Use below if u wanna color some stuff -->
        <!-- <template v-slot:item.calories="{ item }"> 
        <v-chip
            :color="getColor(item.calories)"
            dark
        >
            {{ item.calories }}
        </v-chip>
        </template> -->
        <template v-slot:footer>
            <v-pagination
                v-model="page"
                class="my-5 pb-5"
                :length="pageCount"
            ></v-pagination>
        </template>
      </v-data-table>
      
      </v-card>
 </template>

<script>
export default {
    props: {
        headers: {
            type: Array,
            default: function() {
                return [];
            },
        },
        items: {
            type: Array,
            default: function() {
                return [];
            },
        },
        tableInfo: {
            type: Array,
            default: function() {
                return {tableTitle: 'Empty Table'};
            },
        },
    },
    data() {
        return{
            page: 1,
            pageCount: 0,
            search:'',
        };
    },
    methods: {
      getColor (calories) {
        if (calories > 400) return 'red'
        else if (calories > 200) return 'orange'
        else return 'green'
      },
    },
}
</script>
