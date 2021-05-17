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
                                    <v-tab v-if="appointment.status==='finalized'">Diagnosis</v-tab>
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
                                                Status:
                                            </v-row>
                                            <v-row>
                                                {{appointment.status}}
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
                            <v-card tile class="pa-5">
                                <v-card-title class="text-h4 datatablefontcolor--text font-weight-bold">
                                    <v-row>
                                        <v-col>Diagnosis</v-col>
                                        <v-col class="d-flex justify-end">
                                            <v-btn @click="showDesc=!showDesc" color="datatablefontcolor" class="white--text rounded-lg font-weight-bold">{{showDesc?"Hide Description": "Show Description"}}</v-btn>
                                        </v-col>
                                    </v-row>
                                </v-card-title>
                                <v-card-text class="ml-5 mt-5 datatablefontcolor--text">
                                    <PaginationTable v-if="!showDesc" :tableInfo="DiagTableInfo" :items="tableInfo.diagItems" :headers="diagHeaders">
                                    </PaginationTable>
                                    <v-card v-if="showDesc">
                                        <v-card-text class="datatablefontcolor--text">
                                            {{diag}}
                                        </v-card-text>
                                    </v-card>
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
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="removeSymptom(item)" color="datatablefontcolor"><v-icon>mdi-delete</v-icon></v-btn>
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
                                            <v-btn @click="symptomAdd(symptoms)" :disabled="(!!symptoms ? false : true)" width="100%" height="64%" large color="#558EFE" class="white--text rounded-lg font-weight-bold">
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
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="removeTest(item)" color="datatablefontcolor" class="mr-3"><v-icon>mdi-delete</v-icon></v-btn>
                                                </template>
                                                <span>Delete</span>
                                            </v-tooltip>
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on, attrs }">
                                                    <v-btn @click="$emit('viewResult', item)" :disabled="item.status === 'assigned'? true:false" icon v-bind="attrs" v-on="on" color="datatablefontcolor" class="mr-3"><v-icon>mdi-clipboard-text-outline</v-icon></v-btn>
                                                </template>
                                                <span>View Results</span>
                                            </v-tooltip>
                                        </template>
                                    </PaginationTable>
                                    <v-row class="mt-5">
                                        <v-col>
                                            <v-autocomplete outlined clearable return-object item-text="test_name" prepend-inner-icon="mdi-magnify" v-model="tests" :items="lists.testsList" label="Pick Tests to Add" multiple>
                                            </v-autocomplete>   
                                        </v-col>
                                        <v-col lg="2">
                                            <v-btn @click="testAdd" :disabled="(!!tests ? false : true)" width="100%" height="64%" large color="#558EFE" class="white--text rounded-lg font-weight-bold">
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
                                                    <v-btn icon v-bind="attrs" v-on="on" @click="removePres(item)" color="datatablefontcolor" class="mr-3"><v-icon>mdi-delete</v-icon></v-btn>
                                                </template>
                                                <span>Delete</span>
                                            </v-tooltip>
                                        </template>
                                    </PaginationTable>
                                    <v-row class="mt-5">
                                        <v-col>
                                            <v-autocomplete outlined clearable prepend-inner-icon="mdi-magnify" return-object item-text="name" v-model="pres" :items="lists.medList" label="Pick Medicines to Add">
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
        showDesc: false,
        id: '',
        doctor:'',
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
        DiagTableInfo: {
            tableTitle: 'Diagnosis',
            itemsKey: 'name',
            itemsPerPage: 3,
        },
        lists: {
          symptomsList: [],
          medList: [],
          testsList: [],
          compList: [],
          labsList: [], 
          diseaseList: [],
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
        diagHeaders: [
            {
                text: 'Disease Name',
                align: 'start',
                value: 'name',
                class: 'datatablefontcolor--text'
            },
            { text: 'Description', value: 'desc', class: 'datatablefontcolor--text' },
        ],
    }),
    props:{
        diag: {
            type: String,
            default: ''
        },
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
        async symptomAdd(){
            this.$emit('overlay')
            await this.symptoms.forEach(x => {
                let temp = this.tableInfo.symptomItems.filter(y => y.name === x.name)
                if (temp.length === 0) {
                    this.$http.post(this.$url + `/doctor/${this.id}/insert_patient_symptoms`, {
                        appointment_id: this.appointment.id,
                        symptom_name: x.name
                    }).then(res => {
                        console.log(res)
                        this.$emit('err', `Symptom(s) has been added to patient symptoms`);
                    }).catch(err => {
                        console.log(err)
                        this.$emit('err', 'Unexpected Error, could not load data');
                    }).finally(()=>{
                        
                    })
                }
            })
            this.$emit('overlay')
            this.$emit('snackbar')
            this.$emit('symptomAdd')
            this.symptoms = null
        },
        async removeSymptom(item){
            this.$emit('overlay')
            await this.$http.post(this.$url+`/doctor/${this.id}/delete_symptom`, {
                appointment_id: this.appointment.id,
                symptom_name: item.name
            }).then(res => {
                console.log(res)
                this.$emit('err', `${item.name} has been deleted`);
            }).catch(err => {
                console.log(err)
                this.$emit('err', 'Unexpected Error, could not delete item');
            })
            this.$emit('overlay')
            this.$emit('snackbar')
            this.$emit('symptomAdd')
        },
        async testAdd() {
            this.$emit('overlay')
            await this.tests.forEach(x => {
                let temp = this.tableInfo.testItems.filter(y => y.name === x.name)
                if (temp.length === 0) {
                    let temp = this.lists.labsList.filter(y => y.department === x.department)
                    this.$http.post(this.$url + `/doctor/${this.id}/ask_for_tests`, {
                        appointment_id: this.appointment.id,
                        laboratorian_id: temp[this.rnd(0, temp.length -1)].id,
                        test_name: x.test_name,
                        date: this.toIsoString(new Date()).substring(0, 10)
                    }).then(res => {
                        console.log(res)
                        this.$emit('err', `Test(s) has been added to patient tests`);
                    }).catch(err => {
                        console.log(err.response)
                        this.$emit('err', 'Unexpected Error, could not load data');
                    }).finally(()=>{
                        
                    })
                }
            })
            this.$emit('overlay')
            this.$emit('snackbar')
            this.$emit('testAdd')
            this.tests = null
        },
        async removeTest(item){
            this.$emit('overlay')
            await this.$http.post(this.$url+`/doctor/${this.id}/delete_assigned_test`, {
                appointment_id: this.appointment.id,
                test_name: item.name
            }).then(res => {
                console.log(res)
                this.$emit('err', `${item.name} has been deleted`);
            }).catch(err => {
                console.log(err)
                this.$emit('err', 'Unexpected Error, could not delete item');
            })
            this.$emit('overlay')
            this.$emit('snackbar')
            this.$emit('testAdd')
        },
        async validateForm(){
            this.$refs.form.validate()
            if (this.valid) {
                this.$emit('overlay')
                let temp = this.tableInfo.presItems.filter(y => y.name === this.pres.name)
                console.log(temp)
                if (temp.length === 0) {
                    await this.$http.post(this.$url + `/doctor/${this.id}/add_medicine_to_presc`, {
                        prescription_no: this.appointment.id,
                        med_name: this.pres.name,
                        qty: this.qty,
                        usage_method: this.usage
                    }).then(res => {
                        console.log(res)
                        this.pres = null
                        this.qty = ''
                        this.usage= ''
                        this.$emit('err', `Medicine has been added to prescription`);
                    }).catch(err => {
                        console.log(err.response)
                        this.$emit('err', 'Unexpected Error, could not load data');
                    }).finally(()=>{
                        this.$emit('snackbar')
                    })
                }
                this.dialog = false
                this.$emit('overlay')
                this.$emit('validateForm')
            }
        },
        async removePres(item){
            this.$emit('overlay')
            await this.$http.post(this.$url+`/doctor/${this.id}/delete_medicine`, {
                appointment_id: this.appointment.id,
                med_name: item.name
            }).then(res => {
                console.log(res)
                this.$emit('err', `${item.name} has been deleted`);
            }).catch(err => {
                console.log(err)
                this.$emit('err', 'Unexpected Error, could not delete item');
            })
            this.$emit('overlay')
            this.$emit('snackbar')
            this.$emit('validateForm')
        },
        async validatedisease(){
            this.$refs.form1.validate()
            if (this.valid1) {
                this.$emit('overlay')
                await this.disease.forEach(x => {
                    this.$http.post(this.$url + `/doctor/${this.id}/make_diagnosis`, {
                        appointment_id: this.appointment.id,
                        disease_name: x.name,
                        description: this.deets  
                    }).then(res => {
                        console.log(res)
                        this.$emit('err', `Diagnosis Added`);
                    }).catch(err => {
                        console.log(err)
                        this.$emit('err', `Unknown error, try again`);
                    }).finally(()=>{

                    })
                })
                this.diagDialog = false
                this.$emit('overlay')
                this.$emit('snackbar')
                this.$emit('diagnosis')
            }
        },
        async getLists(){
            this.$emit('overlay')
            await this.$http.get(this.$url+`/doctor/${this.id}/get_disease_names`).then(res => {
            res.data.forEach(x => {
              let temp = {
                name: x.name,
                description: x.description
              }
              this.lists.diseaseList.push(temp)
            })
          }).catch((err) => {
            console.log(err)
            this.$emit('err', 'Unexpected Error, could not load data'); 
            this.$emit('overlay')
            this.$emit('snackbar')
          })
          //get symptom list
          await this.$http.get(this.$url+`/doctor/${0}/get_symptom_names`).then(res => {
            res.data.forEach(x => {
              let temp = {
                name: x.name,
                description: x.description
              }
              this.lists.symptomsList.push(temp)
            })
          }).catch((err) => {
            console.log(err)
            this.$emit('err', 'Unexpected Error, could not load data');
            this.$emit('overlay')
            this.$emit('snackbar')
          })
          //get test list
          await this.$http.get(this.$url+`/doctor/${this.id}/get_test_types`).then(res => {
              console.log(res)
            res.data.forEach(x => {
              this.lists.testsList.push(x)
            })
          }).catch((err) => {
            console.log(err)
            this.$emit('err', 'Unexpected Error, could not load data');
            this.$emit('overlay')
            this.$emit('snackbar')
          })
          //med, comp, labs
          await this.$http.get(this.$url+`/doctor/${0}/get_medicines`).then(res => {
              console.log(res)
            res.data.forEach(x => {
              this.lists.medList.push(x)
            })
          }).catch((err) => {
            console.log(err)
            this.$emit('err', 'Unexpected Error, could not load data');
            this.$emit('overlay')
            this.$emit('snackbar')
          })

          await this.$http.get(this.$url+`/doctor/${this.id}/get_laboratorians`).then(res => {
            console.log(res)
            res.data.forEach(x => {
                this.lists.labsList.push({
                    id: x.national_id,
                    name: this.capitalise(x.name, x.surname),
                    department: x.department
                })
            })
          }).catch((err) => {
            console.log(err)
            this.$emit('err', 'Unexpected Error, could not load data');
            this.$emit('overlay')
            this.$emit('snackbar')
          })
        //   console.log(this.lists.labsList)
        },
        rnd (a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
    },
    created(){
        this.id = this.$cookies.get('user').national_id
        let temp = this.$cookies.get('user').name
        let temp1 = this.$cookies.get('user').surname
        this.doctor = this.capitalise(temp, temp1)
        this.getLists()
    },
    computed:{
        getModel(){
            return this.model
        },
        checkDisabled(){
            let temp = this.tableInfo.testItems.filter(x => x.status !== 'finalized')
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