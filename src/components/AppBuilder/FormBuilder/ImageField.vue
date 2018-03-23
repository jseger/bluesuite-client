<template>
  <v-layout>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs6>
          <v-btn 
          outline 
          :icon="icon"
          @click="onPickImage" :disabled="disabled" :style="readonly ? 'pointer-events:none;' : ''"><v-icon>insert_photo</v-icon> {{label}}</v-btn>
          <input 
          type="file" 
          style="display: none;" 
          ref="imageInput" 
          accept="image/*"
          @change="onImagePicked">
        </v-flex>
        <v-flex xs6 v-if="preview && ($data._image !== null && $data._image !== undefined)">
          <div @click="onPickImage">
          <img :src="$data._image.imageUrl" :height="$data._height"></div>
          <v-btn @click="onRemoveImage" v-if="$data._image.imageUrl && !readonly" flat icon>
            <v-icon>delete</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-flex>
      
    <v-dialog v-model="dialog">
      <v-btn slot="activator" v-if="canEditField" color="blue darken-2" flat icon>
        <v-icon>edit</v-icon>
      </v-btn>
      <v-card>
        <v-card-text>
          <v-text-field label="Label" required v-model="mutable.label"></v-text-field>
          <v-text-field label="Database Field Name (camelCase without spaces)" required v-model="mutable.name"></v-text-field>
          <v-checkbox label="Required" v-model="mutable.required"></v-checkbox>
          <v-checkbox label="Show Preview" v-model="mutable.preview"></v-checkbox>
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
  props: ['image', 'label', 'preview', 'icon', 'height', 'required', 'width', 'name', 'canEditField', 'disabled', 'readonly'],
  data () {
    return {
      _height: '150px',
      mutable: {
        label: '',
        name: '',
        required: false,
        calculation: '',
        validation: '',
        width: '',
        preview: true
      },
      dialog: false,
      _image: {
        imageUrl: null,
        filename: null
      }
    }
  },
  created () {
    if (this.height === null || this.height === undefined || this.height === '') {
      this._height = '150px'
    } else {
      this._height = this.height
    }
    this.mutable = {
      label: this.label,
      name: this.name,
      required: this.required,
      calculation: this.calculation,
      validation: this.validation,
      width: this.width,
      preview: this.preview
    }
    this.$data._image = this.image
  },
  computed: {
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
        const image = {imageUrl: fileReader.result, filename: filename}
        console.log(image)
        this.$emit('imageChanged', image)
        this.$data._image = image
      })
      fileReader.readAsDataURL(files[0])
    },
    onRemoveImage () {
      this.$refs.imageInput.value = null
      this.$data._image = null
      this.$emit('imageChanged', null)
    },
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
        calculation: this.calculation,
        validation: this.validation,
        width: this.width,
        preview: this.preview
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
