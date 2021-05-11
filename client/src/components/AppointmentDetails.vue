<template>
    <v-app>
        <v-container fluid>
            <v-dialog v-model="getModel" persistent>
                <v-card tile class="pt-5">
                    <v-card-text>
                        <v-row>
                            <v-col>
                                <v-tabs v-model="tabs">
                                    <v-tab>Overview</v-tab>
                                    <v-tab>Symptoms</v-tab>
                                    <v-tab>Tests</v-tab>
                                    <v-tab>Prescriptions</v-tab>
                                </v-tabs>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col class="d-flex justify-end">
                                <v-btn icon @click="$emit('close')" color="datatablefontcolor"><v-icon>mdi-close</v-icon></v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card tile>
                    <v-tabs-items v-model="tabs">
                        <v-tab-item>
                            <v-card tile class="pa-5">
                                <v-card-title class="text-h4 datatablefontcolor--text font-weight-bold">
                                    Appointment: {{appointment.id}}
                                </v-card-title>
                                <v-card-text class="ml-5 mt-5 datatablefontcolor--text">
                                    <v-row>
                                        <v-col>
                                            <v-row class="headline">
                                                Patient ID:
                                            </v-row>
                                            <v-row>
                                                {{appointment.pid}}
                                            </v-row>
                                        </v-col>
                                        <v-col>
                                            <v-row class="headline">
                                                Patient Name:
                                            </v-row>
                                            <v-row>
                                                {{appointment.name}}
                                            </v-row>
                                        </v-col>
                                        <v-col>
                                            <v-row class="headline">
                                                Date:
                                            </v-row>
                                            <v-row>
                                                {{appointment.date}}
                                            </v-row>
                                        </v-col>
                                        <v-col>
                                            <v-row class="headline">
                                                Age:
                                            </v-row>
                                            <v-row>
                                                {{appointment.age}}
                                            </v-row>
                                        </v-col>
                                        <v-spacer></v-spacer>
                                        <v-col class="d-flex justify-end mr-7">
                                            <v-btn @click="diagDialog = true" :disabled="checkDisabled" color="#5080DE" outlined large class="rounded-pill font-weight-bold mt-n3">Diagnose</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card tile class="px-5">
                                <v-card-title class="text-h4 datatablefontcolor--text font-weight-bold">
                                    Patient Symptoms
                                </v-card-title>
                                <v-card-text class="mt-5 datatablefontcolor--text">
                                    <PaginationTable :tableInfo="symptomsTableInfo" :items="tableInfo.symptomItems" :headers="symptomHeaders" :buttonHeader="buttonHeader">
                                        <template #buttons={item}>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="$emit('removeSymptom', item)" color="datatablefontcolor"><v-icon>mdi-delete</v-icon></v-btn>
                                                </template>
                                                <span>Delete</span>
                                            </v-tooltip>
                                        </template>
                                    </PaginationTable>
                                    <v-row class="mt-5">
                                        <v-col>
                                            <v-autocomplete outlined clearable return-object item-text="name" prepend-inner-icon="mdi-magnify" v-model="symptoms" :items="lists.symptomsList" label="Pick Symptoms to Add" multiple>
                                            </v-autocomplete>   
                                        </v-col>
                                        <v-col lg="2">
                                            <v-btn @click="$emit('symptomAdd', symptoms); symptoms = null"  :disabled="(!!symptoms ? false : true)" width="100%" height="64%" large color="#558EFE" class="white--text rounded-lg font-weight-bold">
                                                Add
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card tile class="px-5">
                                <v-card-title class="text-h4 datatablefontcolor--text font-weight-bold">
                                    Tests
                                </v-card-title>
                                <v-card-text class="mt-5 datatablefontcolor--text">
                                    <PaginationTable :tableInfo="testsTableInfo" :items="tableInfo.testItems" :headers="testHeaders" :buttonHeader="buttonHeader">
                                        <template #buttons={item}>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="$emit('removeTest', item)" color="datatablefontcolor" class="mr-3"><v-icon>mdi-delete</v-icon></v-btn>
                                                </template>
                                                <span>Delete</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" color="datatablefontcolor" class="mr-3"><v-icon>mdi-collapse-all-outline</v-icon></v-btn>
                                                </template>
                                                <span>View Components</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" color="datatablefontcolor" class="mr-3"><v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
                                                </template>
                                                <span>View Results</span>
                                            </v-tooltip>
                                        </template>
                                    </PaginationTable>
                                    <v-row class="mt-5">
                                        <v-col>
                                            <v-autocomplete outlined clearable prepend-inner-icon="mdi-magnify" v-model="tests" :items="lists.testsList" label="Pick Tests to Add" multiple>
                                            </v-autocomplete>   
                                        </v-col>
                                        <v-col lg="2">
                                            <v-btn @click="$emit('testAdd', tests); tests = null" :disabled="(!!tests ? false : true)" width="100%" height="64%" large color="#558EFE" class="white--text rounded-lg font-weight-bold">
                                                Add
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            <v-card tile class="px-5">
                                <v-card-title class="text-h4 datatablefontcolor--text font-weight-bold">
                                    Prescription
                                </v-card-title>
                                <v-card-text class="mt-5 datatablefontcolor--text">
                                    <PaginationTable :tableInfo="presTableInfo" :items="tableInfo.presItems" :headers="presHeaders" :buttonHeader="buttonHeader">
                                        <template #buttons={item}>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="$emit('removePres', item)" color="datatablefontcolor" class="mr-3"><v-icon>mdi-delete</v-icon></v-btn>
                                                </template>
                                                <span>Delete</span>
                                            </v-tooltip>
                                        </template>
                                    </PaginationTable>
                                    <v-row class="mt-5">
                                        <v-col>
                                            <v-autocomplete outlined clearable prepend-inner-icon="mdi-magnify" return-object item-text="name" v-model="pres" :items="lists.presList" label="Pick Medicines to Add">
                                            </v-autocomplete>   
                                        </v-col>
                                        <v-col lg="2">
                                            <v-btn @click="addPres" :disabled="(!!pres ? false : true)" width="100%" height="64%" large color="#558EFE" class="white--text rounded-lg font-weight-bold">
                                                Add
                                            </v-btn>
                                        </v-col>
                                        <v-dialog
                                            v-model="dialog"
                                            persistent
                                            max-width="30vw"
                                        >
                                            <v-card>
                                            <v-card-title class="headline datatablefontcolor--text text-center">
                                                {{!!pres?pres.name: ''}} Usage Info
                                            </v-card-title>
                                            <v-card-text class="mt-4">
                                                <!-- maybe use cached items prop -->
                                                <v-form ref="form" v-model="valid">
                                                    <v-row class="mt-4">
                                                        <v-col>
                                                        <v-text-field
                                                            outlined
                                                            v-model="qty"
                                                            clearable
                                                            :rules="[v => v.length <=10 || 'Give further details in usage section', v => !!v || 'Quantity to prescribe is required']"
                                                            label="Quantity"
                                                            required
                                                        ></v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                    <v-row class="mt-n7">
                                                        <v-col>
                                                        <v-textarea
                                                            outlined
                                                            v-model="usage"
                                                            label="Usage Method"
                                                            clearable
                                                            rows="4"
                                                            :disabled="(!!qty ? false : true)"
                                                            :rules="[v => !!v || 'At least provide context on what qty is, e.g. bottle, pill']"
                                                            requred
                                                            ></v-textarea>
                                                        </v-col>
                                                    </v-row>
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
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-dialog>
            <v-dialog
                v-model="diagDialog"
                persistent
                max-width="70vw"
            >
                <v-card>
                <v-card-title class="headline datatablefontcolor--text text-center">
                    Diagnosis
                    <v-row>
                        <v-col class="d-flex justify-end">
                            <v-btn icon @click="diagDialog = false" color="datatablefontcolor" class="mt-2 mr-2"><v-icon>mdi-close</v-icon></v-btn>
                        </v-col>
                    </v-row>
                </v-card-title>
                <v-card-text class="mt-4">
                    <!-- maybe use cached items prop -->
                    <v-form ref="form1" v-model="valid1">
                        <v-autocomplete :rules="[v => !!v.length > 0 || 'Disease is required']" outlined return-object item-text="name" clearable prepend-inner-icon="fas fa-disease" v-model="disease" :items="lists.diseaseList" label="Disease" multiple>
                        </v-autocomplete>
                        <v-row class="mt-n4">
                            <v-col>
                            <v-textarea
                                outlined
                                v-model="deets"
                                label="Details"
                                clearable
                                rows="4"
                                :rules="[v => !!v || 'Provide some context on the diagnosis']"
                                requred
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                    color="datatablefontcolor"
                    text
                    @click="diaDialog=false"
                    >
                    Cancel
                    </v-btn>
                    <v-btn
                    color="datatablefontcolor"
                    text
                    @click="validatedisease"
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
    data:()=>({
        disease: [],
        diagDialog: false,
        qty: '',
        usage: '',
        valid: false,
        valid1: false,
        deets: '',
        dialog:false,
        symptoms: null,
        pres: null,
        tests: null,
        tabs: null,
        buttonHeader:"actions",
        symptomsTableInfo: {
            tableTitle: 'Symptoms',
            itemsKey: 'name',
            itemsPerPage: 3,
        },
        testsTableInfo: {
            tableTitle: 'Tests',
            itemsKey: 'name',
            itemsPerPage: 3,
        },
        presTableInfo: {
            tableTitle: 'Medicines',
            itemsKey: 'name',
            itemsPerPage: 3,
        },
        symptomHeaders: [
            {
                text: 'Symptom Name',
                align: 'start',
                value: 'name',
                class: 'datatablefontcolor--text'
            },
            { text: 'Symptom Details', value: 'details', class: 'datatablefontcolor--text' },
            { text: 'Actions', value: 'actions', class: 'datatablefontcolor--text' },
        ],
        testHeaders: [
            {
                text: 'Test Name',
                align: 'start',
                value: 'name',
                class: 'datatablefontcolor--text'
            },
            { text: 'Date Ordered', value: 'date', class: 'datatablefontcolor--text' },
            { text: 'Laboratorian', value: 'lab', class: 'datatablefontcolor--text' },
            { text: 'Status', value: 'status', class: 'datatablefontcolor--text' },   
            { text: 'Actions', value: 'actions', class: 'datatablefontcolor--text' },   
        ],
        presHeaders: [
            {
                text: 'Medicine Name',
                align: 'start',
                value: 'name',
                class: 'datatablefontcolor--text'
            },
            { text: 'Manufacturer', value: 'man', class: 'datatablefontcolor--text' },
            { text: 'Date Prescribed', value: 'date', class: 'datatablefontcolor--text' },
            { text: 'Quantity', value: 'qty', class: 'datatablefontcolor--text' },
            { text: 'Usage Method', value: 'usg', class: 'datatablefontcolor--text' },
            { text: 'Actions', value: 'actions', class: 'datatablefontcolor--text' },
        ],
    }),
    props:{
        appointment:{
            type: Object,
            default: () => {
                return {}
            }
        },
        tableInfo:{
            type: Object,
            default: () => {
                return {}
            }
        },
        lists:{
            type: Object,
            default: () => {
                return {}
            }
        },
        model:{
            type: Boolean,
            default: false
        }
    },
    components: {PaginationTable},
    methods: {
        addPres(){
            this.dialog=true;
            if(this.$refs.form) {
                this.$refs.form.resetValidation()   
            }
        },
        validateForm(){
            this.$refs.form.validate()
            if (this.valid) {
                this.$emit('validateForm', {pres: this.pres, qty: this.qty, usage: this.usage})
                this.dialog = false;
                this.pres = null
                this.qty = ''
                this.usage = ''
            }
        },
        validatedisease(){
            this.$refs.form1.validate()
            if (this.valid1) {
                this.$emit('diagnosis', {disease: this.disease, details: this.deets})
                this.diagDialog=false
                this.disease = [],
                this.deets = ''
            }
        }
    },
    computed:{
        getModel(){
            return this.model
        },
        checkDisabled(){
            let temp = this.tableInfo.testItems.filter(x => x.status !== 'Finalised')
            if (temp.length === 0) {
                return false
            }
            else{
                return true
            }
        }
    }
}
</script>

<style>

</style>