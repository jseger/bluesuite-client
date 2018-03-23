<template>
  <v-layout row v-if="isAuthenticated && !loading">
    <v-flex xs12>
      <v-card>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-title>My Forms</v-toolbar-title>
        </v-toolbar>
        <v-list two-line>
          <template v-for="app in apps">
            <v-list-tile :key="app._id" @click="navigate('/home/appForm/' + app._id)">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{app.name}}
                </v-list-tile-title>
                <v-list-tile-sub-title></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn color="grey lighten-1" @click.stop="onDelete(app)" flat><v-icon>delete_forever</v-icon></v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      apps: [],
      loading: false
    }
  },
  created () {
    var _this = this
    this.$store.dispatch('setLoading', true)
    axios.get('/user/me')
      .then((result) => {
        console.log(result)
        _this.apps = result.data.user.sharedWithMe
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.$store.dispatch('setLoading', false)
      })
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    navigate (url) {
      this.$router.push(url)
    }
  }
}
</script>
