<template>
  <v-container>
      <v-dialog
        v-model="dialogState"
        persistent
        >
        <v-card v-if="dialogMode === 'table'">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col class="d-flex justify-start align-center" v-if="back">
                        <v-btn icon @click="$emit('back')" color="datatablefontcolor"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
                    </v-col>
                    <v-col class="d-flex justify-end align-center">
                        <v-btn icon @click="$emit('close')" color="datatablefontcolor"><v-icon>mdi-close</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-title class="headline datatablefontcolor--text font-weight-bold mt-n8">
                {{!!title ? title : ''}}
            </v-card-title>
            <v-card-subtitle v-if="!!subtitle" class="blue--text text--lighten-3 pt-1">
                {{subtitle}}
            </v-card-subtitle>

            <v-card-text>
                <PaginationTable class="mb-5" :items="tableData.items" :headers="tableData.headers" :tableInfo="tableData.tableInfo" :buttonHeader="tableData.buttonHeader">
                    <template #buttons={item}>
                        <slot name="tableActions" :item="item"></slot>
                    </template>
                </PaginationTable>
            </v-card-text>
        </v-card>
        <v-card v-else-if="dialogMode === 'cols'">
            <v-card-text class="pt-5">
                <v-row>
                    <v-col class="d-flex justify-start align-center" v-if="back">
                        <v-btn icon @click="$emit('back')" color="datatablefontcolor"><v-icon>mdi-keyboard-backspace</v-icon></v-btn>
                    </v-col>
                    <v-col class="d-flex justify-end align-center">
                        <v-btn icon @click="$emit('close')" color="datatablefontcolor"><v-icon>mdi-close</v-icon></v-btn>
                    </v-col>
                </v-row>
            </v-card-text>

            <v-card-title class="headline datatablefontcolor--text font-weight-bold mt-n8">
                {{!!title ? title : ''}}
            </v-card-title>

            <v-card-subtitle v-if="!!subtitle" class="blue--text text--lighten-3 pt-1">
                {{subtitle}}
            </v-card-subtitle>

            <v-card-text>
                <v-row>
                <v-col cols="3" class="">
                    <div v-for="(value, name) in item" :key="name" class="mt-6 ml-6">
                        <v-row align="start">
                            <span class="text-h6 datatablefontcolor--text font-weight-bold">{{itemHeader[itemHeader.findIndex(x => x.value === name)].text}}:</span>
                        </v-row>
                        <v-row align="start">
                            <span class="text-subtitle-1 datatablefontcolor--text">{{ (value == null) ? '-' : value}}</span>
                        </v-row>
                    </div>
                </v-col>
                <!-- <v-spacer></v-spacer> -->
                <v-col>
                    <PaginationTable :items="tableData.items" :headers="tableData.headers" :tableInfo="tableData.tableInfo" :buttonHeader="tableData.buttonHeader">
                        <template #buttons={item}>
                            <slot name="tableActions" :item="item"></slot>
                        </template>
                    </PaginationTable>
                </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        </v-dialog>
  </v-container>
</template>

<script>
import PaginationTable from "@/components/PaginationTable";
export default {
    props:{
        itemHeader: {
            type: Array,
            default: function() {
                return null;
            }
        },
        item:{
            type: Object,
            default: function() {
                return null;
            } 
        },
        tableData: {
            type: Object,
            default: function() {
                return null;
            }
        },
        back: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '',
        },
        subtitle: {
            type: String,
            default: '',
        },
        dialogMode: {
            type: String,
            default: 'table'
        },
        dialog: {
            type: Boolean,
            required: true
        },
    },
    data: () => ({
    }),
    computed: {
        dialogState: function(){
            return this.dialog
        }
    },
    components: {
        PaginationTable
    }
};
</script>

<style scoped>

</style>