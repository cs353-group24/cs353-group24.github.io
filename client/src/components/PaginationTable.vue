<template>
      <v-card class="rounded-md" color="datatablecolor" style="color:#4874C8">
        <v-card-title>
        {{tableInfo.tableTitle}}
        <v-spacer></v-spacer>
        <v-text-field
            color="datatablefontcolor"
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
        class="elevation-1 datatablecolor datatablefontcolor--text"
        :page.sync="page"
        :search="search"
        :hide-default-footer="true"
        :loading="(items.length === 0)? true:false"
        loading-text="Loading... Please wait"
        @page-count="pageCount = $event"
      >
        <!-- :custom-filter="filterOnlyCapsText" can be used to implement a filter if needed, check data-table in vuetify -->
        <!-- Use below if u wanna color some stuff -->
        <template v-slot:[`item.${col.name}`]="{ item }" v-for="col in color"> 
        <v-chip
            v-if="(!!color)"
            :key="col.name"
            :color="getColor(item[`${col.name}`])"
            dark
            :text-color="'white'"
        >
            {{ item[`${col.name}`] }}
        </v-chip>
        <template v-else>
            {{ item[`${col.name}`] }}
        </template>
        </template>
        <template v-slot:[`item.${buttonHeader}`]={item}>
            <slot name="buttons" :item="item"></slot>
        </template>
        <template v-slot:footer>
            <v-pagination
                v-model="page"
                color="#4874C8"
                :length="pageCount"
                class="pb-3"
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
            type: Object,
            default: function() {
                return {tableTitle: 'Empty Table'};
            },
        },
        buttonHeader: {
            type: String,
            default: ''
        },
        color: {
            type: Array,
            default: function() {
                return null;
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
      getColor: function(itemColVal) {
          this.$emit('get-color', itemColVal);
          return this.color.color;
      }
    },
}
</script>
