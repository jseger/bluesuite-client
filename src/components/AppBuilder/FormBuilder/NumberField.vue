<template>
  <v-layout>
    <v-text-field 
      type="number"
      :label="label" 
      :required="required"
      :multi-line="false"
      :prefix="prefix"
      :suffix="suffix" 
      :disabled="disabled"
      :readonly="readonly"
      class="ma-2"
      v-model="_number" @change="$emit('valueChanged', _number)"></v-text-field>

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
          <v-text-field label="Prefix" v-model="mutable.prefix"></v-text-field>
          <v-text-field label="Suffix" v-model="mutable.suffix"></v-text-field>
          <v-select label="Select Width"
            :items="widths"
            item-text="width"
            item-value="class"
            required
            v-model="mutable.width"></v-select>
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
  props: ['number', 'label', 'required', 'prefix', 'suffix', 'name', 'width', 'canEditField', 'disabled', 'readonly'],
  data () {
    return {
      mutable: {
        label: '',
        name: '',
        required: false,
        prefix: '',
        suffix: '',
        calculation: '',
        validation: '',
        width: ''
      },
      dialog: false
    }
  },
  created () {
    this.mutable = {
      label: this.label,
      name: this.name,
      required: this.required,
      prefix: this.prefix,
      suffix: this.suffix,
      calculation: this.calculation,
      validation: this.validation,
      width: this.width
    }
  },
  computed: {
    _number: {
      get () {
        return this.number
      },
      set (value) {
        if (isNaN(value)) {
          return
        }
        console.log(value)
        this.$emit('numberChanged', Number(value))
      }
    },
    widths () {
      let widths = []
      for (let index = 0; index < 12; index++) {
        const element = {
          width: index + 1,
          class: 'xs' + (index + 1)
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
        prefix: this.prefix,
        suffix: this.suffix,
        calculation: this.calculation,
        validation: this.validation,
        width: this.width
      }
      this.dialog = false
    },
    remove () {
      this.$emit('fieldRemoved')
      this.dialog = false
    }
  }
}
</script>
