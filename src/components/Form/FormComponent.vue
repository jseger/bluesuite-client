<template>
<div style="transform: scale(.5); transform-origin: top left;">
  <v-card>
    <v-card-text>
      <v-container>
        <v-layout row wrap>
          <v-flex v-for="field in app.form.fields" :key="field.id" :class="field.width">
            <v-layout row  style="background-color: white;" class="ma-1">
              <bs-table-field  v-if="field.type === 'table'" 
                :label="field.label" 
                :items="data[field.name]" 
                :columns="field.tableColumns"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                :required="field.required"
                v-on:itemAdded="item => data[field.name].push(item)"
                v-on:itemRemoved="item => data[field.name].splice(data[field.name].indexOf(item), 1)"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-table-field>
              <bs-checkbox  v-else-if="field.type === 'checkbox'"
                :label="field.label" 
                :required="field.required" 
                :checkState="data[field.name]" 
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                :disabled="disabled"
                v-on:checkStateChanged="checkState => {data[field.name] = checkState}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-checkbox>
              <bs-text-field v-else-if="field.type === 'text'" 
                :label="field.label" 
                :required="field.required"
                :multiLine="field.multiLine"
                :prefix="field.prefix"
                :suffix="field.suffix" 
                :text="data[field.name]" 
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                :alignText="field.alignText"
                v-on:textChanged="text => {data[field.name] = text}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-text-field>
              <bs-number-field v-else-if="field.type === 'number'" 
                :label="field.label" 
                :required="field.required"
                :multiLine="field.multiLine"
                :prefix="field.prefix"
                :suffix="field.suffix" 
                :number="data[field.name]" 
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                v-on:numberChanged="number => {data[field.name] = number}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-number-field>
              <bs-date-field v-else-if="field.type === 'date'" 
                :label="field.label" 
                :date="data[field.name]" 
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                :required="field.required"
                v-on:dateChanged="date => {data[field.name] = date}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-date-field>
              <bs-image-field v-else-if="field.type === 'image'" :image="data[field.name]" 
                :label="field.label" 
                :preview="field.preview"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                :required="field.required"
                v-on:imageChanged="image => {data[field.name] = image}" 
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-image-field>
              <bs-radio-button-field v-else-if="field.type === 'radio'"
                :label="field.label" 
                :required="field.required" 
                :horizontal="field.horizontal" 
                :selectedOption="data[field.name]" 
                :options="field.options"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                v-on:selectionChanged="option => {data[field.name] = option}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-radio-button-field>
              <bs-select-field v-else-if="field.type === 'select'" 
                :label="field.label" 
                :selectedOption="data[field.name]" 
                :options="field.options" 
                :required="field.required"
                :multiple="field.multiple"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                v-on:selectionChanged="option => {data[field.name] = option}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-select-field>
              <bs-label-field v-else-if="field.type === 'label'"
                :label="field.label"
                :width="field.width"
                :icon="field.labelIcon"
                :color="field.labelColor"
                :required="field.required"
                :canEditField="false"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-label-field>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      </v-card-text>
       <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :color="state.color" v-for="(state, i) in app.workflow.states" :key="i" v-if="state.userAction" @click="submit(state.name)" :loading="busy">
          {{state.actionName}}
        </v-btn>
        <v-btn v-if="app.workflow.allowSaveForm" @click="save()" :loading="busy">Save</v-btn>
        <v-btn @click="submissionDialog = false" :loading="busy">Cancel</v-btn>
      </v-card-actions>
  </v-card>
</div>
</template>

<script>
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

export default {
  props: ['app', 'disabled'],
  data () {
    return {
      data: { },
      busy: false
    }
  },
  components: {
    'bs-image-field': BsImageField,
    'bs-date-field': BsDateField,
    'bs-text-field': BsTextField,
    'bs-checkbox': BsCheckboxField,
    'bs-number-field': BsNumberField,
    'bs-table-field': BsTabelField,
    'v-edit-field': BsEditFieldDialog,
    'bs-radio-button-field': BsRadioButtonField,
    'bs-select-field': BsSelectField,
    'bs-label-field': BsLabelField
  }
}
</script>
