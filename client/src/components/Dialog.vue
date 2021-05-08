<template>
  <v-container>
      <v-dialog
        v-model="dialogState"
        persistent
        >
        <v-card v-if="dialogMode === 'table'">
            <v-card-text class="pt-5">
            <slot name="topButtons"></slot>
            </v-card-text>
            <v-card-title class="headline datatablefontcolor--text font-weight-bold mt-n8">
                {{title}}
            </v-card-title>
            <v-card-subtitle v-if="!!subtitle" class="blue--text text--lighten-3 pt-1">
                {{subtitle}}
            </v-card-subtitle>

            <v-card-text>
                <slot name="table"></slot>
            </v-card-text>
        </v-card>
        <v-card v-else-if="dialogMode === 'cols'">
            <v-card-text class="pt-5">
            <slot name="topButtons"></slot>
            </v-card-text>
            <v-card-title class="headline datatablefontcolor--text font-weight-bold mt-n8">
                {{title}}
            </v-card-title>
            <v-card-subtitle v-if="!!subtitle" class="blue--text text--lighten-3 pt-1">
                {{subtitle}}
            </v-card-subtitle>

            <v-card-text>
                <v-row>
                <v-col cols="3" class="">
                    <slot name="leftCol"></slot>
                </v-col>
                <!-- <v-spacer></v-spacer> -->
                <v-col>
                    <slot name="righttCol"></slot>
                </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        </v-dialog>
  </v-container>
</template>

<script>
export default {
    props:{
        title: {
            type: String,
            required: true,
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
    }
};
</script>

<style scoped>

</style>