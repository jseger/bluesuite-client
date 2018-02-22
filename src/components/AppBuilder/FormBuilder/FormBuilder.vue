<template>
  <v-layout row wrap>
    <v-flex xs2>
      <v-card flat>
        <v-card-title>
          <v-toolbar color="grey lighten-4" flat>
            <v-toolbar-title>Form Controls</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-list dense>
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
    <v-flex xs10>
      <v-card :v-if="!loading" flat color="grey lighten-2">
        <v-card-title>
          <v-toolbar color="grey lighten-2" flat>
            <v-toolbar-title>Drag the Form Controls Below</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
              <v-container>
                <draggable element="v-layout" row wrap
                v-model="form.fields" 
                :options="{group: {name: 'fields'}}" 
                style="min-height: 100px; background-color: white;"
                class="pb-5">
                  <v-flex v-for="(field, i) in form.fields" :key="field.id" :class="field.width">
                    <v-layout row>
                      <v-field 
                      :id="field.name" 
                      :field.sync="field" xs11 
                      :value="field.value" 
                      v-on:input="value => {field.value = value}" 
                      v-on:valueChanged="onValueChanged(field)"
                      v-on:itemAdded="item => onItemAdded(field, item)"
                      v-on:itemRemoved="item => onItemRemoved(field, item)"
                      v-on:itemValueChanged="i => onItemValueChanged(field, i.item, i.prop)"></v-field>
                      <v-edit-field :field="field" :index="i" v-on:ok="onOk" v-on:removeField="onRemoveField" xs1 class="text-xs-right"></v-edit-field>
                    </v-layout>
                  </v-flex>
                </draggable>
              </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Vue from 'vue'
import draggable from 'vuedraggable'
import VField from '@/components/AppBuilder/FormBuilder/Field'
import VFieldEditDialog from '@/components/AppBuilder/FormBuilder/FieldEditDialog'

Vue.use(draggable)

Vue.component('v-field', VField)
Vue.component('v-edit-field', VFieldEditDialog)

export default {
  props: ['form'],
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
        width: 'xs12 pa-3',
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
        width: 'xs12 pa-3',
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
        width: 'xs12 pa-3',
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
        width: 'xs12 pa-3',
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
        width: 'xs12 pa-3',
        calculation: '',
        value: null,
        defaultValue: null
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
        width: 'xs12 pa-3',
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
        width: 'xs12 pa-3',
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
        width: 'xs12 pa-3',
        calculation: '',
        value: null,
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
        width: 'xs12 pa-3',
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
        width: 'xs12 pa-3',
        alignText: 'text-xs-center',
        calculation: '',
        value: []
      }]
    }
  },
  created () {
    // needed to make value property reactive
    let fields = []
    this.form.fields.forEach(field => fields.push(Object.assign({}, field)))
    this.form.fields.splice(0)
    fields.forEach(field => {
      if (field.type === 'table') {
        field.value = []
      } else {
        field.value = field.defaultValue
      }
      this.form.fields.push(field)
    })
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
      const element = {}
      for (var key in original) {
        if (original.hasOwnProperty(key)) {
          element[key] = original[key]
        }
      }
      element.id = Date.now()
      return element
    },
    onRemoveField (index) {
      this.form.fields[index].tableColumns = []
      this.form.fields.splice(index, 1)
    },
    removeOption (field, item) {
      field.options.splice(field.options.indexOf(item), 1)
    },
    onOk (obj) {
      this.form.fields.splice(obj.index, 1, Object.assign({}, obj.field))
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
      field.value.push(item)
    },
    onItemRemoved (field, item) {
      const index = field.value.indexOf(item)
      field.value.splice(index, 1)
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loading
    }
  },
  components: {
    draggable
  }
}
</script>
