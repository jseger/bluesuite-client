<template>
<v-container>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-container>
            <form @submit.prevent="onSaveName">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    name="name"
                    label="Name"
                    id="name"
                    v-model="name"
                    type="text" required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-checkbox v-model="changeEmail" label="Change Email"></v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    name="email"
                    label="Email"
                    id="email"
                    v-model="email"
                    type="email"
                    required :disabled="!changeEmail">
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field 
                    name="password"
                    label="Password"
                    id="password"
                    v-model="password"
                    type="password"
                    v-if="changeEmail"
                    :rules="[checkPassword]">
                  </v-text-field>                  
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs4>
                  <v-btn 
                  raised
                  @click="onPickFile">Upload Image</v-btn>
                  <input 
                  type="file" 
                  style="display: none;" 
                  ref="fileInput" 
                  accept="image/*"
                  @change="onFilePicked">
                </v-flex>
                <v-flex xs8>
                  <img :src="imageUrl" v-if="image" height="150px">
                  <v-btn @click="onRemoveImage" v-if="image" flat icon>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
               <v-layout row>
                <v-flex>
                  <v-btn type="submit" color="primary" :disabled="loading" :loading="loading">
                    Save
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    </v-btn>
                </v-flex>
              </v-layout>
            </form>
          </v-container>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      email: '',
      imageUrl: '',
      image: null,
      changeEmail: false,
      password: ''
    }
  },
  created () {
    this.name = this.user.name
    this.email = this.user.email
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    loading () {
      return this.$store.getters.loading
    },
    checkPassword () {
      if (this.changeEmail) {
        if (this.password === '') {
          return 'Enter Password to change email.'
        }
      }
      return ''
    }
  },
  methods: {
    onSaveName () {
      this.$store.dispatch('updateUser', {name: this.name, email: this.email, password: this.password, image: this.image, changeEmail: this.changeEmail})
    },
    onPickFile () {
      this.$refs.fileInput.click()
    },
    onFilePicked (event) {
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
    onRemoveImage () {
      this.image = null
      this.imageUrl = ''
      this.$refs.fileInput.value = null
    }
  }
}
</script>
