<template>
  <v-layout row wrap>
    <v-flex xs12>
      <template v-if="field.type === 'select'">
        <v-select 
        :label="field.label"
        :required="field.required"
        :multiple="field.multiple"
        :items="field.options"
        autocomplete></v-select>
      </template>
      <template v-if="field.type === 'lookup'">
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
      </template>
      <template v-if="field.type === 'list'">
        <v-container>
          <v-layout>
            <v-flex xs12>
              <p>{{field.label}}</p>
            </v-flex>
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12>
              <v-data-table
                v-bind:headers="field.listItemFormFields"
                :items="childItems"
                hide-actions
                class="elevation-1">
                <template slot="headers" slot-scope="props">
                  <tr>
                    <th :key="i" v-for="(key, i) in field.listItemFormFields"
                    :class="i === 0 ? 'text-xs-left' : 'text-xs-right'">{{key.text}}</th>
                  </tr>
                </template>
                <template slot="items" slot-scope="props">
                  <tr>
                    <td :key="i" v-for="(key, i) in field.listItemFormFields"
                    :class="i === 0 ? 'text-xs-left' : 'text-xs-right'">{{props.item[key.value]}}</td>
                  </tr>
                </template>
              </v-data-table>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
      <template v-else-if="field.type === 'checkbox'">
        <v-checkbox 
        :label="field.label" 
        :required="field.required"></v-checkbox>
      </template>
      <template v-else-if="field.type === 'text'">
        <v-text-field 
        :label="field.label" 
        :required="field.required"
        :multi-line="field.multiLine"
        :prefix="field.prefix"
        :suffix="field.suffix"></v-text-field>
      </template>
      <template v-else-if="field.type === 'number'">
        <v-text-field 
        type="number"
        :label="field.label" 
        :required="field.required"
        :multi-line="field.multiLine"
        :prefix="field.prefix"
        :suffix="field.suffix"></v-text-field>
      </template>
      <template v-else-if="field.type === 'date'">
       <v-menu
        lazy
        :close-on-content-click="false"
        v-model="menu"
        transition="scale-transition"
        offset-y
        full-width
        :nudge-right="40"
        max-width="290px"
        min-width="290px"
      >
        <v-text-field
          slot="activator"
          :label="field.label"
          v-model="date"
          prepend-icon="event"
          readonly
        ></v-text-field>
        <v-date-picker v-model="date" no-title scrollable actions>
          <template slot-scope="{ save, cancel }">
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="cancel">Cancel</v-btn>
              <v-btn flat color="primary" @click="save">OK</v-btn>
            </v-card-actions>
          </template>
        </v-date-picker>
      </v-menu>
      </template>
      <template v-else-if="field.type === 'radio'">
        <v-radio-group :label="field.label" :mandatory="field.required" :row="field.horizontal">
          <template v-for="opt in field.options">
            <v-radio :label="opt" :value="opt" :key="opt"></v-radio>
          </template>
        </v-radio-group>
      </template>
      <template v-else-if="field.type === 'image'">
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
          </v-flex>
        </v-layout>
      </template>
      <template v-else-if="field.type === 'label'">
        <v-layout row wrap>
          <v-flex xs12>
            <v-alert outline color="info" :value="true">
              {{field.text}}
            </v-alert>
          </v-flex>
        </v-layout>
      </template>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: ['field'],
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
  methods: {
    onPickImage () {
      this.$refs.imageInput.click()
    },
    onImagePicked (event) {
      const files = event.target.files
      let filename = files[0].name
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!')
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', () => {
        this.imageUrl = fileReader.result
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
    }
  }
}
</script>
