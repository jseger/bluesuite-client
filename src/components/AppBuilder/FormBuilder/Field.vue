<template>
  <v-layout>
      <template v-if="field.type === 'select'">
        <v-flex xs12>
          <v-select 
          :label="field.label"
          :required="field.required"
          :multiple="field.multiple"
          :items="field.options"
          v-model="editedValue"
          autocomplete></v-select>
        </v-flex>
      </template>
      <template v-if="field.type === 'lookup'">
        <v-flex xs12>
          <v-select
            :label="field.label"
            autocomplete
            :loading="loading"
            :multiple="field.multiple"
            cache-items
            required
            :items="searchItems"
            :search-input.sync="search"
          ></v-select> 
        </v-flex>     
      </template>
      <template v-if="field.type === 'table'">
        <v-container>
          <v-layout>
            <v-flex xs12>
              <v-btn color="primary" flat @click="addTableItem()">
                 {{field.label}}
                <v-icon left>add</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12>
              <v-data-table
                v-bind:headers="field.tableColumns"
                :items="items"
                hide-actions
                class="elevation-1">
                <template slot="headers" slot-scope="props">
                  <tr>
                    <th class="text-xs-left" style="width: 25px;"></th>
                    <th class="text-xs-left">ID</th>
                    <th :key="i" v-for="(column, i) in field.tableColumns"
                    :class="column.alignText">{{column.label}}</th>
                  </tr>
                </template>
                <template slot="items" slot-scope="props">
                  <tr>
                    <td><v-btn color="error" @click="removeTableItem(props.item)" flat><v-icon>delete_forever</v-icon></v-btn></td>
                    <td>{{props.item}}</td>
                    <td :key="i" v-for="(key, i) in field.tableColumns"
                    :class="key.alignText">
                      <template v-if="key.columnType === 'text'">
                        <v-text-field 
                        :required="key.required"
                        :multi-line="key.multiLine"
                        :prefix="key.prefix"
                        :suffix="key.suffix"
                        v-model="props.item[key.name]" @change="itemValueChanged(props.item, key.name)"></v-text-field>
                      </template>
                      <template v-else-if="key.columnType === 'number'">
                        <v-text-field 
                        type="number"
                        :required="key.required"
                        :multi-line="key.multiLine"
                        :prefix="key.prefix"
                        :suffix="key.suffix"
                        v-model="props.item[key.name]" @change="itemValueChanged(props.item, key.name)"></v-text-field>
                      </template>
                      <template v-else-if="key.columnType === 'checkbox'">
                        <v-flex xs12>
                          <v-checkbox 
                          :required="key.required" v-model="props.item[key.name]" @change="itemValueChanged(props.item, key.name)"></v-checkbox>
                        </v-flex>
                      </template>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
      <template v-else-if="field.type === 'checkbox'">
        <v-flex xs12>
          <v-checkbox 
          :label="field.label" 
          :required="field.required" v-model="editedValue"></v-checkbox>
        </v-flex>
      </template>
      <template v-else-if="field.type === 'text'">
          <v-text-field 
          :label="field.label" 
          :required="field.required"
          :multi-line="field.multiLine"
          :prefix="field.prefix"
          :suffix="field.suffix" 
          v-model="editedValue"></v-text-field>
      </template>
      <template v-else-if="field.type === 'number'">
          <v-text-field 
          type="number"
          :label="field.label" 
          :required="field.required"
          :multi-line="field.multiLine"
          :prefix="field.prefix"
          :suffix="field.suffix"
          v-model="editedValue"></v-text-field>
      </template>
      <template v-else-if="field.type === 'date'">
        <v-flex xs12>
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
              :label="field.label"
              v-model="editedValue"
              prepend-icon="event"
              readonly
            ></v-text-field>
            <v-date-picker v-model="editedValue" no-title scrollable actions>
              <template slot-scope="{ save, cancel }">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
                  <!-- <v-btn flat color="primary" @click="save">OK</v-btn> -->
                </v-card-actions>
              </template>
            </v-date-picker>
          </v-menu>
        </v-flex>
      </template>
      <template v-else-if="field.type === 'radio'">
        <v-flex xs12>
          <v-radio-group :label="field.label" :mandatory="field.required" :row="field.horizontal" v-model="editedValue">
            <template v-for="opt in field.options">
              <v-radio :label="opt" :value="opt" :key="opt"></v-radio>
            </template>
          </v-radio-group>
        </v-flex>
      </template>
      <template v-else-if="field.type === 'image'">
        <v-flex xs12>
          <v-layout row wrap>
            <v-flex xs6>
              <v-btn 
              outline 
              @click="onPickImage"><v-icon>insert_photo</v-icon> {{field.label}}</v-btn>
              <input 
              type="file" 
              style="display: none;" 
              ref="imageInput" 
              accept="image/*"
              @change="onImagePicked">
            </v-flex>
            <v-flex xs6 v-if="field.preview">
              <img :src="imageUrl" height="150px">
              <v-btn @click="onRemoveImage" v-if="image" flat icon>
                <v-icon>delete</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>
      </template>
      <template v-else-if="field.type === 'label'">
        <v-flex xs12>
          <v-alert outline :color="field.labelColor" :icon="field.labelIcon" :value="true">
            {{field.label}}
          </v-alert>
        </v-flex>
      </template>
  </v-layout>
</template>

<script>
export default {
  props: ['field', 'value'],
  data () {
    return {
      date: null,
      menu: false,
      modal: false,
      image: null,
      imageUrl: null,
      search: null,
      searchItems: [],
      fakeSearchItemsPlaceholder: ['item 1', 'item 2', 'item 3'],
      loading: false,
      childItems: [{
        name: 'John Smith',
        category: 'Customer'
      }]
    }
  },
  watch: {
    search (val) {
      val && this.querySelections(val)
    }
  },
  computed: {
    editedValue: {
      get () {
        return this.value
      },
      set (value) { this.valueChanged(value) }
    },
    items: {
      get () {
        return this.value
      }
    }
  },
  methods: {
    onPickImage () {
      this.$refs.imageInput.click()
    },
    onImagePicked (event) {
      const files = event.target.files
      if (files.length === 0) {
        return
      }
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
        this.$emit('input', {imageUrl: this.imageUrl, fileName: filename})
        this.$emit('valueChanged', this.field)
      })
      fileReader.readAsDataURL(files[0])
      this.image = files[0]
    },
    querySelections (v) {
      this.loading = true
      // Simulated ajax query
      setTimeout(() => {
        this.searchItems = this.fakeSearchItemsPlaceholder.filter(e => {
          return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
        })
        this.loading = false
      }, 500)
    },
    onRemoveImage () {
      this.image = null
      this.imageUrl = ''
      this.$refs.imageInput.value = null
      this.$emit('valueChanged', this.field)
    },
    valueChanged (newValue, oldValue) {
      this.$emit('input', newValue)
      this.$emit('valueChanged')
    },
    itemValueChanged (item, prop) {
      this.$emit('itemValueChanged', {item: item, prop: prop})
    },
    addTableItem () {
      let item = {id: Date.now()}
      this.field.tableColumns.forEach(column => {
        item[column.name] = null
      })
      this.$emit('itemAdded', item)
    },
    removeTableItem (item) {
      this.$emit('itemRemoved', item)
    }
  }
}
</script>
