<template>
<v-container>
  <v-layout row v-if="error" mt-5>
    <v-flex xs12 sm6 offset-sm3>
      <app-alert @dismissed="onDismissed" :text="error.message"></app-alert>
    </v-flex>
  </v-layout>
  <v-layout row mt-5>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-text>
          <v-container>
            <form @submit.prevent="onSignin">
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
                 <v-btn color="primary" type="submit" :disabled="loading" :loading="loading">
                    Login
                    <span slot="loader" class="custom-loader">
                      <v-icon light>cached</v-icon>
                    </span>
                  </v-btn>
                  <v-btn router :to="'/register'">
                    Register
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
      password: ''
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    loading () {
      return this.$store.getters.loading
    },
    error () {
      return this.$store.getters.error
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
    onSignin () {
      this.$store.dispatch('login', {email: this.email, password: this.password})
      .then(() => {
        this.$router.push('/home')
      })
      .catch((err) => {
        console.log(err)
      })
    },
    onDismissed () {
      this.$store.dispatch('clearError')
    }
  }
}
</script>
