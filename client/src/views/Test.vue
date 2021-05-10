<template>
    <v-app>
        <v-container fluid>
            <v-dialog v-model="allDialog" persistent>
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
                                <v-btn icon @click="allDialog=false" color="datatablefontcolor"><v-icon>mdi-close</v-icon></v-btn>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
                <v-card tile>
                    <v-tabs-items v-model="tabs">
                        <v-tab-item>
                            <v-card tile class="pa-5">
                                <v-card-title class="text-h5 datatablefontcolor--text">
                                    Appointment: {{appointmentID}}
                                </v-card-title>
                            </v-card>
                        </v-tab-item>
                        <v-tab-item>
                            2
                        </v-tab-item>
                        <v-tab-item>
                            3
                        </v-tab-item>
                        <v-tab-item>
                            4
                        </v-tab-item>
                    </v-tabs-items>
                </v-card>
            </v-dialog>
            <v-btn text @click="allDialog=true">Open Dialog</v-btn>
        </v-container>
    </v-app>
</template>

<script>
export default {
    data: () => ({
        allDialog: false,
        appointmentID: 10,
        tabs: null,
    }),
}
</script>

<style>

</style>