<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card>
        <v-card-title>
          <v-toolbar class="primary" dark>
            <v-toolbar-title>
              Edit Form
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn flat @click="onSave">Save</v-btn>
              <v-btn flat @click="onCancel">Close</v-btn>
            </v-toolbar-items>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs3>
              <v-card>
                <v-card-title>
                  <v-toolbar class="primary" dark>
                    <v-toolbar-title>Form Controls</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                </v-card-title>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-list two-line>
                        <draggable 
                        v-model="formControls" 
                        :options="{sort: false, group: {name: 'fields', pull: 'clone', put: false}}" 
                        style="min-height: 100px"
                        :clone="onCloned"
                        class="pb-5">
                          <v-container v-for="(formControl, i) in formControls" :key="i" draggable="true">
                            <v-list-tile avatar @click="">
                              <v-list-tile-avatar>
                                <v-icon>{{ formControl.icon }}</v-icon>
                              </v-list-tile-avatar>
                              <v-list-tile-content>
                                <v-list-tile-title>{{formControl.description}}</v-list-tile-title>
                              </v-list-tile-content>
                            </v-list-tile>
                          </v-container>
                        </draggable>
                      </v-list>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex xs9>
              <v-card :v-if="!loading">
                <v-card-title>
                  <v-toolbar class="primary" dark>
                    <v-toolbar-title>
                      <v-text-field label="Form Title" v-model="form.title" single-line required></v-text-field>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-text-field label="Form Description" v-model="form.description" single-line></v-text-field>
                  </v-toolbar>
                </v-card-title>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12>
                      <v-list two-line>
                        <draggable 
                        v-model="form.fields" 
                        :options="{group: {name: 'fields'}}" 
                        style="min-height: 100px"
                        class="pb-5">
                          <v-container v-for="(field, i) in form.fields" :key="i">
                            <v-expansion-panel expand>
                              <v-expansion-panel-content>
                                <div slot="header">
                                  <v-field
                                  :field="field"></v-field>
                                </div>
                                <v-card>
                                  <v-card-text>
                                    <v-flex xs12>
                                      <v-text-field
                                      label="Label"
                                      required
                                      v-model="field.label"></v-text-field>
                                    </v-flex>
                                    <v-flex xs12>
                                      <v-text-field
                                      label="Database Field Name (camelCase without spaces)"
                                      required
                                      v-model="field.name"></v-text-field>
                                    </v-flex>
                                    <v-checkbox 
                                    label="Required"
                                    v-model="field.required"></v-checkbox>
                                    <v-checkbox 
                                    label="Show Preview"
                                    v-model="field.preview" 
                                    v-if="field.type === 'image'"></v-checkbox>
                                    <v-checkbox 
                                    v-if="field.type === 'text'"
                                    label="Multiline"
                                    v-model="field.multiLine"></v-checkbox>
                                    <v-text-field
                                    label="Prefix"
                                    v-model="field.prefix"
                                    v-if="['text', 'number'].includes(field.type)"></v-text-field>
                                    <v-text-field
                                    label="Suffix"
                                    v-model="field.suffix"
                                    v-if="['text', 'number'].includes(field.type)"></v-text-field>
                                    <v-select
                                    chips
                                    tags
                                    solo
                                    prepend-icon="radio_button_checked"
                                    append-icon=""
                                    clearable
                                    v-model="field.options"
                                    v-if="['radio', 'select'].includes(field.type)"
                                    >
                                    <template slot="selection" slot-scope="data">
                                      <v-chip
                                        close
                                        @input="removeOption(field, data.item)"
                                        :selected="data.selected"
                                      >
                                        <strong>{{ data.item }}</strong> 
                                      </v-chip>
                                    </template>
                                    </v-select>
                                    <v-checkbox 
                                    v-if="['select', 'lookup'].includes(field.type)"
                                    label="Allow Mutliple Selections"
                                    v-model="field.multiple"></v-checkbox>
                                    <v-checkbox 
                                    v-if="field.type === 'radio'"
                                    label="Horizontal"
                                    v-model="field.horizontal"></v-checkbox>
                                    <v-select
                                    label="Select Data to Lookup"
                                    :items="lookupItems"
                                    required
                                    autocomplete v-if="field.type === 'lookup'"
                                    v-model="field.lookupItem"></v-select>
                                    <v-select
                                    label="Select Child List Items"
                                    :items="lookupItems"
                                    required
                                    autocomplete v-if="field.type === 'list'"
                                    v-model="field.lookupItemForm"></v-select>
                                    <v-select
                                    label="Select Fields to Lookup"
                                    :items="lookupItemFields"
                                    required
                                    multiple
                                    autocomplete 
                                    v-if="field.type === 'lookup' && field.lookupItem"
                                    v-model="field.lookupItemFields"></v-select>
                                    <v-select
                                    label="Select Child List Columns"
                                    :items="lookupItemFields"
                                    required
                                    multiple
                                    autocomplete v-if="field.type === 'list' && field.lookupItemForm"
                                    v-model="field.lookupItemFormFields"></v-select>
                                    <v-btn @click="removeField(field)">Remove Field</v-btn>
                                  </v-card-text>
                                </v-card>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-container>
                        </draggable>
                      </v-list>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import VField from '@/components/Form/Field'

Vue.use(draggable)

Vue.component('v-field', VField)

export default {
  props: ['id'],
  data () {
    return {
      lookupItems: ['Categories', 'Locations', 'Customers', 'Vendors', 'Projects'],
      lookupItemFields: ['Name', 'Category']
    }
  },
  created () {
    this.$store.dispatch('fetchForm', {formId: this.$route.params.id})
  },
  methods: {
    onCancel () {
      this.$router.push('/forms')
    },
    onSave () {
      this.$store.dispatch('saveForm', {id: this.$route.params.id, ...this.form})
    },
    onCloned (original) {
      console.log('cloning')
      const element = {}
      for (var key in original) {
        if (original.hasOwnProperty(key)) {
          element[key] = original[key]
        }
      }
      return element
    },
    removeField (field) {
      this.form.fields.splice(this.form.fields.indexOf(field), 1)
    },
    removeOption (field, item) {
      field.options.splice(field.options.indexOf(item), 1)
    }
  },
  computed: {
    formControls () {
      return this.$store.getters.formControls
    },
    loading () {
      return this.$store.getters.loading
    },
    form () {
      return this.$store.getters.form
    }
  },
  components: {
    draggable
  }
}
</script>
