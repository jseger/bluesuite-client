<template>
  <v-container fluid>
    <v-flex xs12>
      <v-btn color="primary" flat @click="addItem()">
          {{label}}
        <v-icon left>add</v-icon>
      </v-btn>
    </v-flex>
      <v-data-table
        v-bind:headers="columns"
        :items="_items"
        hide-actions 
        :expand="true"
        class="elevation-1">
        <template slot="headers" slot-scope="props">
          <tr>
            <th class="text-xs-left"></th>
            <th :key="i" v-for="(column, i) in columns" :class="column.alignText">{{column.label}}</th>
          </tr>
        </template>
        <template slot="items" slot-scope="props">
          <tr>
            <td><v-btn color="error" @click="removeItem(props.item)" icon flat class="text-xs-left"><v-icon>delete_forever</v-icon></v-btn></td>
            <td :key="i" v-for="(column, i) in columns" :class="column.alignText">
              <template v-if="column.columnType === 'text'">
                <bs-text-field 
                :required="column.required"
                :multi-line="column.multiLine"
                :prefix="column.prefix"
                :suffix="column.suffix" 
                :text="props.item[column.name]" 
                v-on:textChanged="text => {props.item[column.name] = text}"></bs-text-field>
              </template>
              <template v-else-if="column.columnType === 'number'">
                <bs-number-field 
                :required="column.required"
                :multi-line="column.multiLine"
                :prefix="column.prefix"
                :suffix="column.suffix" 
                :number="props.item[column.name]" 
                v-on:textChanged="number => {props.item[column.name] = number}"></bs-number-field>
              </template>
              <template v-else-if="column.columnType === 'checkbox'">
                <bs-checkbox 
                  :required="column.required" :checkState="props.item[column.name]"
                  v-on:checkStateChanged="checkState => {props.item[column.name] = checkState}"></bs-checkbox>
              </template>
              <template v-else-if="column.columnType === 'image'">
                <bs-image-field :image="props.item[column.name]" :icon="true" :height="'50px'" v-on:imageChanged="image => {props.item[column.name] = image}" :preview="column.preview"></bs-image-field>
              </template>
              <template v-else-if="column.columnType === 'date'">
                <bs-date-field :date="props.item[column.name]" 
                v-on:dateChanged="date => {props.item[column.name] = date}"></bs-date-field>
              </template>
              <template v-else-if="column.columnType === 'select'">
                <bs-select-field :label="column.label" 
                    :selectedOption="props.item[column.name]" 
                    :options="column.options" 
                    :required="column.required"
                    :multiple="column.multiple"
                    :name="column.name"
                    :index="i"
                    v-on:selectionChanged="option => {props.item[column.name] = option}"></bs-select-field>
              </template>
            </td>
          </tr>
        </template>
      </v-data-table>

    <v-dialog v-model="dialog">
      <v-btn slot="activator" v-if="canEditField" color="blue darken-2" flat icon>
        <v-icon>edit</v-icon>
      </v-btn>
      <v-card>
        <v-card-text>
          <v-text-field label="Label" required  v-model="mutable.label"></v-text-field>
          <v-text-field label="Database Field Name (camelCase without spaces)" required v-model="mutable.name"></v-text-field>
          <v-checkbox label="Required" v-model="mutable.required"></v-checkbox>
          <v-card>
            <v-card-title>
              <v-btn @click="addColumn()">
                Add Column
                <v-icon left>add</v-icon>
              </v-btn>
            </v-card-title>
            <draggable element="v-layout" row wrap v-model="mutable.tableColumns" :options="{group: {name: 'tableColumns'}}" style="min-height: 100px" class="mb-5">
              <v-flex v-for="(column, i) in mutable.tableColumns" :key="column.id" xs12 class="ma-3">
                <v-layout row wrap>
                  <v-flex xs2>
                    <v-select label="Column Type" :items="columnTypes" v-model="column.columnType"></v-select>
                  </v-flex>
                  <v-flex xs3>
                    <v-radio-group label="Alignment" v-model="column.alignText" :mandatory="true" row>
                      <v-radio label="Left" value="text-xs-left"></v-radio>
                      <v-radio label="Center" value="text-xs-center"></v-radio>
                      <v-radio label="Right" value="text-xs-right"></v-radio>
                    </v-radio-group>
                  </v-flex>
                  <v-flex xs7>
                    <template v-if="column.columnType === 'text'">
                      <bs-text-field :label="column.label"
                      :required="column.required"
                      :multi-line="column.multiLine"
                      :prefix="column.prefix"
                      :name="column.name"
                      :index="i"
                      :canEditField="true"
                      :suffix="column.suffix"
                      :width="column.width"
                      v-on:fieldChanged="editedField => onFieldChanged(column, editedField)"
                      v-on:fieldRemoved="onColumnRemoved(column)"></bs-text-field>
                    </template>
                    <template v-else-if="column.columnType === 'number'">
                      <bs-number-field :label="column.label"
                      :required="column.required"
                      :multi-line="column.multiLine"
                      :prefix="column.prefix"
                      :name="column.name"
                      :index="i"
                      :canEditField="true"
                      :width="column.width"
                      :suffix="column.suffix"
                      v-on:fieldChanged="editedField => onFieldChanged(column, editedField)"
                      v-on:fieldRemoved="onColumnRemoved(column)"></bs-number-field>
                    </template>
                    <template v-else-if="column.columnType === 'checkbox'">
                      <bs-checkbox :label="column.label" 
                        :required="column.required" 
                        :name="column.name" :index="i" 
                        :canEditField="true"
                        v-on:fieldChanged="editedField => onFieldChanged(column, editedField)"
                        v-on:fieldRemoved="onColumnRemoved(column)"></bs-checkbox>
                    </template>
                    <template v-else-if="column.columnType === 'image'">
                      <bs-image-field 
                      :label="column.label"
                      :icon="false" 
                      :name="column.name"
                      :index="i"
                      :height="'50px'" 
                      :preview="column.preview" 
                      :canEditField="true"
                      :width="column.width"
                      v-on:fieldChanged="editedField => onFieldChanged(column, editedField)"
                      v-on:fieldRemoved="onColumnRemoved(column)"></bs-image-field>
                    </template>
                    <template v-else-if="column.columnType === 'date'">
                      <bs-date-field 
                      :label="column.label" 
                      :name="column.name" 
                      :index="i" 
                      :width="column.width"
                      :canEditField="true"
                      v-on:fieldChanged="editedField => onFieldChanged(column, editedField)"
                      v-on:fieldRemoved="onColumnRemoved(column)"></bs-date-field>
                    </template>
                    <template v-else-if="column.columnType === 'select'">
                      <bs-select-field :label="column.label" 
                          :options="column.options" 
                          :required="column.required"
                          :multiple="column.multiple"
                          :name="column.name"
                          :index="i"
                          :canEditField="true"
                          :width="column.width"
                          v-on:fieldChanged="editedField => onFieldChanged(column, editedField)"
                          v-on:fieldRemoved="onColumnRemoved(column)"></bs-select-field>
                    </template>
                  </v-flex>             
                </v-layout>
                <v-divider></v-divider>
              </v-flex>
            </draggable>
          </v-card>
          <v-select label="Select Width"
            :items="widths"
            item-text="width"
            item-value="class"
            required
            v-model="mutable.width">
          </v-select>
          <v-text-field label="Script function(item)" v-model="mutable.calculation"></v-text-field>
          <v-layout row>
            <v-flex xs11>
              <v-btn @click="ok()" color="primary">OK</v-btn>
              <v-btn @click="cancel()">Cancel</v-btn>
            </v-flex>
            <v-flex xs1>
              <v-btn @click="remove()" color="error">Remove Field</v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import BsTextField from '@/components/AppBuilder/FormBuilder/TextField'
import BsNumberField from '@/components/AppBuilder/FormBuilder/NumberField'
import BsDateField from '@/components/AppBuilder/FormBuilder/DateField'
import BsImageField from '@/components/AppBuilder/FormBuilder/ImageField'
import BsCheckboxField from '@/components/AppBuilder/FormBuilder/CheckboxField'
import BsSelectField from '@/components/Appbuilder/FormBuilder/SelectField'

import draggable from 'vuedraggable'

export default {
  props: ['columns', 'label', 'items', 'canEditField', 'width', 'name', 'required'],
  data () {
    return {
      mutable: null,
      dialog: false,
      columnTypes: ['text', 'number', 'date', 'checkbox', 'select', 'lookup', 'image']
    }
  },
  created () {
    let m = {
      label: this.label,
      name: this.name,
      required: this.required,
      calculation: this.calculation,
      validation: this.validation,
      width: this.width,
      tableColumns: []
    }
    m.tableColumns.splice(0)
    this.columns.forEach(column => {
      m.tableColumns.push(Object.assign({}, column))
    })

    this.mutable = m
  },
  components: {
    'bs-image-field': BsImageField,
    'bs-date-field': BsDateField,
    'bs-text-field': BsTextField,
    'bs-checkbox': BsCheckboxField,
    'bs-number-field': BsNumberField,
    'bs-select-field': BsSelectField,
    'draggable': draggable
  },
  computed: {
    _items: {
      get () {
        return this.items
      }
    },
    widths () {
      let widths = []
      for (let index = 0; index < 12; index++) {
        const element = {
          width: index + 1,
          class: 'xs' + (index + 1) + ' pa-3'
        }
        widths.push(element)
      }
      return widths
    }
  },
  methods: {
    removeOption (column, item) {
      column.options.splice(column.options.indexOf(item), 1)
    },
    addColumn () {
      this.mutable.tableColumns.push({
        id: Date.now().toString(),
        label: 'Column' + (this.mutable.tableColumns.length + 1),
        columnType: 'text',
        alignText: 'text-xs-left',
        name: 'column' + (this.mutable.tableColumns.length + 1),
        suffix: '',
        prefix: '',
        required: true,
        width: 'xs12 pa-3',
        mutliLine: false,
        validation: '',
        calculation: '',
        options: [],
        multiple: true
      })
    },
    addItem () {
      let item = {id: Date.now().toString()}
      this.columns.forEach(column => {
        item[column.name] = null
      })
      this.items.push(item)
      this.$emit('itemAdded', item)
    },
    removeItem (item) {
      this.items.splice(this.items.indexOf(item), 1)
      this.$emit('itemRemoved', item)
    },
    ok () {
      console.log(this.mutable)
      this.momento = Object.assign({}, this.mutable)
      this.$emit('fieldChanged', this.momento)
      this.dialog = false
    },
    cancel () {
      let m = {
        label: this.label,
        name: this.name,
        required: this.required,
        calculation: this.calculation,
        validation: this.validation,
        width: this.width,
        tableColumns: []
      }
      m.tableColumns.splice(0)
      this.columns.forEach(column => {
        m.tableColumns.push(Object.assign({}, column))
      })

      this.mutable = m
      this.dialog = false
    },
    remove () {
      this.$emit('fieldRemoved')
      this.dialog = false
    },
    onFieldChanged (field, editedField) {
      for (const key in editedField) {
        if (field.hasOwnProperty(key)) {
          field[key] = editedField[key]
        }
      }
    },
    onColumnRemoved (column) {
      console.log('column removed method on table builder')
      this.mutable.tableColumns.splice(this.mutable.tableColumns.indexOf(column), 1)
    }
  }
}
</script>
