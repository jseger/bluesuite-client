<template>
  <v-layout>
    <v-radio-group :label="label" :mandatory="required" :row="horizontal" v-model="_selectedOption">
      <template v-for="opt in options">
        <v-radio :label="opt" :value="opt" :key="opt"></v-radio>
      </template>
    </v-radio-group>  

    <v-dialog v-model="dialog" dialog>
      <v-btn slot="activator" v-if="canEditField" color="blue darken-2" flat icon>
        <v-icon>edit</v-icon>
      </v-btn>
      <v-card>
        <v-card-text>
          <v-flex xs12>
            <v-text-field label="Label" required v-model="mutable.label"></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field label="Database Field Name (camelCase without spaces)" required v-model="mutable.name"></v-text-field>
          </v-flex>
          <v-checkbox label="Required" v-model="mutable.required"></v-checkbox>

          <v-select chips tags solo clearable
            prepend-icon="radio_button_checked"
            append-icon=""
            v-model="mutable.options">
              <template slot="selection" slot-scope="data">
                <v-chip close @input="removeOption(data.item)" :selected="data.selected">
                  <strong>{{ data.item }}</strong> 
                </v-chip>
              </template>
          </v-select>

          <v-checkbox 
            label="Horizontal"
            v-model="mutable.horizontal">
          </v-checkbox>
          <v-select label="Select Width"
            :items="widths"
            item-text="width"
            item-value="class"
            required
            v-model="mutable.width">
          </v-select>
          <v-text-field label="Script function(item)" v-model="mutable.calculation" multi-line></v-text-field>
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
  </v-layout>
</template>

<script>
export default {
  props: ['options', 'label', 'selectedOption', 'horizontal', 'required', 'canEditField', 'width', 'name'],
  data () {
    return {
      mutable: null,
      dialog: false
    }
  },
  created () {
    this.mutable = {
      label: this.label,
      name: this.name,
      required: this.required,
      multiLine: this.multiLine,
      prefix: this.prefix,
      suffix: this.suffix,
      calculation: this.calculation,
      validation: this.validation,
      width: this.width,
      options: this.options,
      horizontal: this.horizontal
    }
  },
  computed: {
    _selectedOption: {
      get () {
        return this.selectedOption
      },
      set (value) {
        this.$emit('selectionChanged', value)
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
    ok () {
      console.log(this.mutable)
      this.$emit('fieldChanged', this.mutable)
      this.dialog = false
    },
    cancel () {
      this.mutable = {
        label: this.label,
        name: this.name,
        required: this.required,
        multiLine: this.multiLine,
        prefix: this.prefix,
        suffix: this.suffix,
        calculation: this.calculation,
        validation: this.validation,
        width: this.width,
        options: this.options,
        horizontal: this.horizontal
      }
      this.dialog = false
    },
    remove () {
      this.$emit('fieldRemoved')
      this.dialog = false
    },
    removeOption (item) {
      this.mutable.options.splice(this.mutable.options.indexOf(item), 1)
    }
  }
}
</script>

