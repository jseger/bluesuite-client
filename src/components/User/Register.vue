<template>
<v-container>
  <v-layout row v-if="!loading">
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-text>
          <v-container>
            <form @submit.prevent="onRegister">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    name="name"
                    label="Name"
                    id="name"
                    v-model="name"
                    type="text"
                    required>
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
                  <v-btn type="submit" color="primary" :disabled="loading" :loading="loading">
                    Register
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
                   <v-btn router :to="'/login'">
                    Login
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
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    }
  },
  computed: {
    comparePasswords () {
      return this.password !== this.confirmPassword
        ? 'Passwords do not match'
        : true
    },
    user () {
      return this.$store.getters.user
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    user (value) {
      if (value !== null && value !== undefined) {
        this.$router.push('/home')
      }
    }
  },
  methods: {
    onRegister () {
      this.$store.dispatch('registerUser', {email: this.email, password: this.password, name: this.name})
      .then(() => {
        this.$router.push('/home')
      })
      .catch((err) => {
        this.$store.dispatch('pushError', err.message)
      })
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    }
  }
}
</script>
