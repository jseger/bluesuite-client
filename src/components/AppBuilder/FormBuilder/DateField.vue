<template>
  <v-layout>
    <v-flex xs12 class="ma-2">
      <v-menu
        lazy
        :close-on-content-click="true"
        v-model="menu"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        max-width="290px"
        min-width="290px">
        <v-text-field
          slot="activator"
          :label="label"
          v-model="_date"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="_date" no-title scrollable actions>
          <template slot-scope="{ save, cancel }">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
            </v-card-actions>
          </template>
        </v-date-picker>
      </v-menu>
    </v-flex>

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
  props: ['date', 'label', 'name', 'calculation', 'validation', 'width', 'canEditField', 'required'],
  data () {
    return {
      menu: null,
      mutable: {
        label: '',
        name: '',
        required: false,
        multiLine: false,
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
      multiLine: this.multiLine,
      prefix: this.prefix,
      suffix: this.suffix,
      calculation: this.calculation,
      validation: this.validation,
      width: this.width
    }
  },
  computed: {
    _date: {
      get () {
        return this.date
      },
      set (value) {
        this.$emit('dateChanged', value)
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
        multiLine: this.multiLine,
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
