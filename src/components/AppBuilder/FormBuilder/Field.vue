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
        <bs-table-field :label="field.label" :items="field.value" :columns="field.tableColumns" v-on:itemAdded="item => {this.field.value.push(item)}"></bs-table-field>
        <!-- <v-container>
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
                          <v-checkbox 
                          :required="key.required" v-model="props.item[key.name]" @change="itemValueChanged(props.item, key.name)"></v-checkbox>
                      </template>
                      <template v-else-if="key.columnType === 'image'">
                        <v-flex xs12>
                          <v-layout row wrap>
                            <v-flex xs6>
                              <v-btn 
                              outline 
                              @click="$refs.imageInput[props.index].click()"><v-icon>insert_photo</v-icon> {{key.label}}</v-btn>
                              <input 
                              type="file" 
                              style="display: none;" 
                              ref="imageInput" 
                              accept="image/*"
                              @change="onItemImagePicked">
                            </v-flex>
                            <v-flex xs6 v-if="true">
                              <img :src="props.item[key.name]" height="35px">
                              <v-btn @click="onRemoveImage" v-if="props.item[key.name]" flat icon>
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </v-flex>
                          </v-layout>
                        </v-flex>
                      </template>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container> -->
      </template>
      <template v-else-if="field.type === 'checkbox'">
        <bs-checkbox 
          :label="field.label" 
          :required="field.required" :checkState="field.value" v-on:checkStateChanged="checkState => {field.value = checkState}"></bs-checkbox>
      </template>
      <template v-else-if="field.type === 'text'">
          <bs-text-field 
          :label="field.label" 
          :required="field.required"
          :multi-line="field.multiLine"
          :prefix="field.prefix"
          :suffix="field.suffix" 
          :text="field.value" v-on:textChanged="text => {field.value = text}"></bs-text-field>
      </template>
      <template v-else-if="field.type === 'number'">
          <bs-number-field 
          :label="field.label" 
          :required="field.required"
          :multi-line="field.multiLine"
          :prefix="field.prefix"
          :suffix="field.suffix" 
          :number="field.value" v-on:numberChanged="number => {field.value = number}"></bs-number-field>
      </template>
      <template v-else-if="field.type === 'date'">
        <bs-date-field :label="field.label" :date="field.value" v-on:dateChanged="date => {field.value = date}"></bs-date-field>
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
        <bs-image-field :image="field.value" :text="field.label" v-on:imageChanged="image => {field.value = image}" :preview="field.preview"></bs-image-field>
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
import BsTextField from '@/components/AppBuilder/FormBuilder/TextField'
import BsNumberField from '@/components/AppBuilder/FormBuilder/NumberField'
import BsDateField from '@/components/AppBuilder/FormBuilder/DateField'
import BsImageField from '@/components/AppBuilder/FormBuilder/ImageField'
import BsCheckboxField from '@/components/AppBuilder/FormBuilder/CheckboxField'
import BsTabelField from '@/components/Appbuilder/FormBuilder/TableField'

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
    onItemImagePicked (event, item) {
      console.log(event)
      console.log(item)
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
        item.value = {imageUrl: fileReader.result, fileName: filename}
        this.$emit('itemValueChanged', {item: item, prop: item.name})
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
  },
  components: {
    'bs-image-field': BsImageField,
    'bs-date-field': BsDateField,
    'bs-text-field': BsTextField,
    'bs-checkbox': BsCheckboxField,
    'bs-number-field': BsNumberField,
    'bs-table-field': BsTabelField
  }
}
</script>
