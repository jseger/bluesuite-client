<template>
  <v-container :v-if="!loading" >
    <v-layout row>
      <v-flex xs12>
        <v-alert outline color="info" icon="info" :value="true">
          Editing the form after it is in use may complicate integration with the data tables.  Make sure you know what you're doing!
        </v-alert>
        <v-card>
          <v-toolbar color="light-blue lighten-2" dark>
          <v-toolbar-title>Design Form</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
          <v-card-text>
            <v-container>
              <v-layout row>
                <v-flex xs2>
                  <v-list dense>
                    <draggable 
                    v-model="formControls" 
                    :options="{sort: false, group: {name: 'fields', pull: 'clone', put: false}, draggable: '.field-item'}" 
                    style="min-height: 100px"
                    :clone="onCloned"
                    class="pb-5">
                      <v-container v-for="(formControl, i) in formControls" :key="i" draggable="true" class="field-item">
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
                <v-flex xs10>
                  <v-container>
                    <draggable element="v-layout" row wrap
                    :list="form.fields"
                    :options="{group: {name: 'fields'}, draggable: '.field-item'}" 
                    style="background-color: #CFD8DC;" 
                    class="pb-5">
                      <v-flex v-for="(field, i) in form.fields" :key="field.id" :class="field.width + ' field-item' ">
                        <v-layout row  style="background-color: white;" class="ma-1">
                          <bs-table-field  v-if="field.type === 'table'" 
                            :label="field.label" 
                            :items="field.value" 
                            :columns="field.tableColumns"
                            :name="field.name"
                            :width="field.width"
                            :canEditField="true"
                            :required="field.required"
                            v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                            v-on:fieldRemoved="onFieldRemoved(i)"></bs-table-field>
                          <bs-checkbox  v-else-if="field.type === 'checkbox'"
                              :label="field.label" 
                              :required="field.required" 
                              :checkState="field.value" 
                              :name="field.name"
                              :width="field.width"
                              :canEditField="true"
                              v-on:checkStateChanged="checkState => {field.value = checkState}"
                              v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                              v-on:fieldRemoved="onFieldRemoved(i)"></bs-checkbox>
                          <bs-text-field v-else-if="field.type === 'text'" 
                            :label="field.label" 
                            :required="field.required"
                            :multiLine="field.multiLine"
                            :prefix="field.prefix"
                            :suffix="field.suffix" 
                            :text="field.value" 
                            :name="field.name"
                            :width="field.width"
                            :canEditField="true"
                            :alignText="field.alignText"
                            v-on:textChanged="text => {field.value = text}"
                            v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                            v-on:fieldRemoved="onFieldRemoved(i)"></bs-text-field>
                          <bs-number-field v-else-if="field.type === 'number'" 
                            :label="field.label" 
                            :required="field.required"
                            :multiLine="field.multiLine"
                            :prefix="field.prefix"
                            :suffix="field.suffix" 
                            :number="field.value" 
                            :name="field.name"
                            :width="field.width"
                            :canEditField="true"
                            v-on:numberChanged="number => {field.value = number}"
                            v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                            v-on:fieldRemoved="onFieldRemoved(i)"></bs-number-field>
                          <bs-date-field v-else-if="field.type === 'date'" 
                            :label="field.label" 
                            :date="field.value" 
                            :name="field.name"
                            :width="field.width"
                            :canEditField="true"
                            :required="field.required"
                            v-on:dateChanged="date => {field.value = date}"
                            v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                            v-on:fieldRemoved="onFieldRemoved(i)"></bs-date-field>
                          <bs-image-field v-else-if="field.type === 'image'" :image="field.value" 
                            :label="field.label" 
                            :preview="field.preview"
                            :name="field.name"
                            :width="field.width"
                            :canEditField="true"
                            :required="field.required"
                            v-on:imageChanged="image => {field.value = image}" 
                            v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                            v-on:fieldRemoved="onFieldRemoved(i)"></bs-image-field>
                          <bs-radio-button-field v-else-if="field.type === 'radio'"
                            :label="field.label" 
                            :required="field.required" 
                            :horizontal="field.horizontal" 
                            :selectedOption="field.value" 
                            :options="field.options"
                            :name="field.name"
                            :width="field.width"
                            :canEditField="true"
                            v-on:selectionChanged="option => {field.value = option}"
                            v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                            v-on:fieldRemoved="onFieldRemoved(i)"></bs-radio-button-field>
                          <bs-select-field v-else-if="field.type === 'select'" 
                            :label="field.label" 
                            :selectedOption="field.value" 
                            :options="field.options" 
                            :required="field.required"
                            :multiple="field.multiple"
                            :name="field.name"
                            :width="field.width"
                            :canEditField="true"
                            v-on:selectionChanged="option => {field.value = option}"
                            v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                            v-on:fieldRemoved="onFieldRemoved(i)"></bs-select-field>
                          <bs-label-field v-else-if="field.type === 'label'"
                            :label="field.label"
                            :width="field.width"
                            :icon="field.labelIcon"
                            :color="field.labelColor"
                            :required="field.required"
                            :canEditField="true"
                            v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                            v-on:fieldRemoved="onFieldRemoved(i)"></bs-label-field>
                        </v-layout>
                      </v-flex>
                    </draggable>
                  </v-container>
                  <v-container>
                    <v-layout row>
                      <v-flex xs12 class="text-xs-right">
                        <v-menu top v-for="(state, i) in workflow.states" :key="i" v-if="state.userAction">
                          <v-btn :color="state.color" slot="activator">
                            {{state.actionName}}
                          </v-btn>
                          <v-card>
                            <v-card-text>
                              These buttons are in design mode.
                            </v-card-text>
                          </v-card>
                        </v-menu>
                        <v-menu>
                          <v-btn v-if="workflow.allowSaveForm" slot="activator">Save</v-btn>
                           <v-card>
                            <v-card-text>
                              These buttons are in design mode.
                            </v-card-text>
                          </v-card>
                        </v-menu>
                        <v-menu>
                        <v-btn v-if="workflow.allowSaveForm" slot="activator">Cancel</v-btn>
                           <v-card>
                            <v-card-text>
                              These buttons are in design mode.
                            </v-card-text>
                          </v-card>
                        </v-menu>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import BsEditFieldDialog from '@/components/AppBuilder/FormBuilder/FieldEditDialog'
import BsTextField from '@/components/AppBuilder/FormBuilder/TextField'
import BsNumberField from '@/components/AppBuilder/FormBuilder/NumberField'
import BsDateField from '@/components/AppBuilder/FormBuilder/DateField'
import BsImageField from '@/components/AppBuilder/FormBuilder/ImageField'
import BsCheckboxField from '@/components/AppBuilder/FormBuilder/CheckboxField'
import BsTabelField from '@/components/Appbuilder/FormBuilder/TableField'
import BsRadioButtonField from '@/components/Appbuilder/FormBuilder/RadioButtonField'
import BsSelectField from '@/components/Appbuilder/FormBuilder/SelectField'
import BsLabelField from '@/components/AppBuilder/FormBuilder/LabelField'
import BsPlaceHolder from '@/components/AppBuilder/FormBuilder/PlaceHolderField'

Vue.use(draggable)

export default {
  props: ['form', 'workflow'],
  data () {
    return {
      menu: null,
      lookupItems: ['Categories', 'Locations', 'Customers', 'Vendors', 'Projects'],
      lookupItemFields: ['Name', 'Category'],
      formControls: [{
        id: 'asdfasdfasdf',
        icon: 'text_fields',
        type: 'text',
        description: 'Text',
        label: 'Text',
        name: 'textField1',
        required: true,
        multiLine: false,
        prefix: '',
        suffix: '',
        width: 'xs12',
        calculation: '',
        value: '',
        defaultValue: ''
      },
      {
        id: 'utytfjujkhdjhjhg',
        icon: 'plus_one',
        type: 'number',
        description: 'Number',
        label: 'Number',
        name: 'numberField1',
        required: true,
        prefix: '',
        suffix: '',
        width: 'xs12',
        calculation: '',
        value: 0,
        defaultValue: 0
      },
      {
        id: 'afgrefdgfgg',
        icon: 'check_box',
        type: 'checkbox',
        description: 'Checkbox',
        label: 'Checkbox',
        name: 'checkboxField1',
        required: true,
        width: 'xs12',
        calculation: '',
        value: false,
        defaultValue: true
      },
      {
        id: 'aasdfasdfeww',
        icon: 'arrow_drop_down_circle',
        type: 'select',
        description: 'Combobox',
        label: 'Combobox',
        name: 'comboxboxField1',
        required: true,
        multiple: false,
        width: 'xs12',
        calculation: '',
        value: null,
        defaultValue: null,
        options: [
          'Option 1',
          'Option 2',
          'Option 3'
        ]
      },
      {
        id: 'efeqefasfaf',
        icon: 'event',
        type: 'date',
        description: 'Date',
        label: 'Date',
        name: 'dateField1',
        required: true,
        width: 'xs12',
        calculation: '',
        value: null,
        defaultValue: new Date()
      },
      {
        id: 'sfgfqrfqer',
        icon: 'label',
        type: 'label',
        labelColor: 'info',
        labelIcon: null,
        description: 'Label',
        required: false,
        label: 'Some imortant message',
        name: 'label',
        childListFields: [],
        width: 'xs12',
        calculation: '',
        value: '',
        defaultValue: ''
      },
      {
        id: 'fasdfasddfasfd',
        icon: 'radio_button_checked',
        type: 'radio',
        description: 'Radio Buttons',
        label: 'Radio Buttons',
        name: 'radioButtonsField1',
        required: true,
        horizontal: false,
        width: 'xs12',
        calculation: '',
        value: '',
        defaultValue: '',
        options: [
          'Option 1',
          'Option 2',
          'Option 3'
        ]
      },
      {
        id: 'asdfvqrqew',
        icon: 'insert_photo',
        type: 'image',
        description: 'Image',
        label: 'Image',
        name: 'imageField',
        required: true,
        preview: true,
        width: 'xs12',
        calculation: '',
        value: {
          imageUrl: null,
          filename: null
        },
        defaultValue: '',
        imageUrl: null
      },
      {
        id: 'asdfajkwqeioas',
        icon: 'search',
        type: 'lookup',
        description: 'Lookup Field',
        label: 'Lookup Field',
        name: 'lookupField1',
        required: true,
        multiple: false,
        lookupList: null,
        lookupListFields: [],
        width: 'xs12',
        calculation: '',
        value: {},
        defaultValue: {}
      },
      {
        id: 'sfgfqrfqer',
        icon: 'reorder',
        type: 'table',
        required: false,
        description: 'Table',
        label: 'Table',
        name: 'table1',
        tableColumns: [],
        width: 'xs12',
        alignText: 'text-xs-center',
        calculation: '',
        value: []
      }]
    }
  },
  created () {
    // if the form fields are empty, we'll add a dummy field
/*     if (this.form.fields === null || this.form.fields.length === 0) {
      this.form.fields = [{
        id: '1',
        type: 'placeholder'
      }]
    }
 */
    // needed to make value property reactive
/*     let fields = []
    this.form.fields.forEach(field => fields.push(Object.assign({}, field)))
    this.form.fields.splice(0)
    fields.forEach(field => {
      if (field.type === 'table') {
        field.value = []
      } else {
        field.value = field.defaultValue
      }
      this.form.fields.push(field)
    }) */
  },
  methods: {
    field (name) {
      return this.form.fields.find(function (field) {
        return field.name === name
      })
    },
    onCancel () {
      this.$router.push('/forms')
    },
    onSave () {
      this.$store.dispatch('saveForm', {id: this.$route.params.id, ...this.form})
    },
    onCloned (original) {
      console.log('cloning')
      let element = {}
      for (var key in original) {
        if (original.hasOwnProperty(key)) {
          element[key] = original[key]
        }
      }
      element.id = Date.now().toString()
      console.log(element)
      return element
    },
    onValueChanged (field) {
      // eslint-disable-next-line
      eval(field.calculation)
    },
    onItemValueChanged (field, item, prop) {
      const column = field.tableColumns.find(column => {
        return column.name === prop
      })
      // eslint-disable-next-line
      eval(column.calculation)
    },
    onItemAdded (field, item) {
      console.log(item)
      field.value.push(item)
    },
    onItemRemoved (field, item) {
      const index = field.value.indexOf(item)
      field.value.splice(index, 1)
    },
    onFieldChanged (field, editedField) {
      for (const key in field) {
        if (field.hasOwnProperty(key) && editedField.hasOwnProperty(key)) {
          field[key] = editedField[key]
        }
      }
    },
    onFieldRemoved (index) {
      this.form.fields[index].tableColumns = []
      this.form.fields.splice(index, 1)
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  components: {
    'draggable': draggable,
    'bs-image-field': BsImageField,
    'bs-date-field': BsDateField,
    'bs-text-field': BsTextField,
    'bs-checkbox': BsCheckboxField,
    'bs-number-field': BsNumberField,
    'bs-table-field': BsTabelField,
    'v-edit-field': BsEditFieldDialog,
    'bs-radio-button-field': BsRadioButtonField,
    'bs-select-field': BsSelectField,
    'bs-label-field': BsLabelField,
    'bs-placeholder': BsPlaceHolder
  }
}
</script>
