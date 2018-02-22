<template>
<v-container>
  <v-tabs id="mobile-tabs-5" fixed icons grow v-if="!loading">
    <v-toolbar color="light-blue">
      <v-tabs-bar class="transparent" dark slot="extension">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tabs-item href="#profile">
          <v-icon>person</v-icon>
          Profile
        </v-tabs-item>
        <v-tabs-item href="#password">
          <v-icon>lock</v-icon>
          Password
        </v-tabs-item>
      </v-tabs-bar>
    </v-toolbar>
    <v-tabs-items>
      <v-tabs-content id="profile">
        <v-card flat>
          <v-card-text>
          <form @submit.prevent="onUpdateProfile">
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
                  <v-text-field
                    name="email"
                    label="Email"
                    id="email"
                    v-model="email"
                    type="email"
                    required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <!-- <v-layout row>
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
              </v-layout> -->
               <v-layout row>
                <v-flex>
                  <v-btn type="submit" color="primary" :disabled="busy" :loading="busy">
                    Save
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    </v-btn>
                </v-flex>
              </v-layout>
            </form>
            </v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="password">
        <v-card flat>
          <v-card-text>
            <v-card-text>
          <form @submit.prevent="onChangePassword">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field 
                    name="password"
                    label="Password"
                    id="password"
                    v-model="password"
                    type="password"
                    required>
                  </v-text-field>                  
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field 
                    name="newPassword"
                    label="New Password"
                    id="newPassword"
                    v-model="newPassword"
                    type="password">
                  </v-text-field>                  
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex>
                  <v-text-field 
                    name="confirmPassword"
                    label="Confirm Password"
                    id="confirmPassword"
                    v-model="confirmPassword"
                    type="password"
                    required
                    :rules="[comparePasswords]">
                  </v-text-field>
                </v-flex>
              </v-layout>
               <v-layout row>
                <v-flex>
                  <v-btn type="submit" color="primary" :disabled="busy" :loading="busy">
                    Save
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                    </v-btn>
                </v-flex>
              </v-layout>
            </form>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-tabs-content>
    </v-tabs-items>
  </v-tabs>
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
      password: '',
      newPassword: '',
      confirmPassword: '',
      busy: false
    }
  },
  created () {
    this.name = this.user.name
    this.email = this.user.email
  },
  computed: {
    comparePasswords () {
      return this.newPassword !== this.confirmPassword
        ? 'Passwords do not match'
        : true
    },
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
    onUpdateProfile () {
      this.busy = true
      this.$store.dispatch('updateUser', {name: this.name, email: this.email, password: this.password, image: this.image, changeEmail: this.changeEmail})
      .then(result => {
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.busy = false
      })
    },
    onChangePassword () {
      this.busy = true
      this.$store.dispatch('changePassword', {password: this.password, newPassword: this.newPassword})
      .then(result => {
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        this.busy = false
      })
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
