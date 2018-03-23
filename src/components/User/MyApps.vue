<template>
  <v-layout row v-if="isAuthenticated && !loading">
    <v-flex xs12>
      <v-card>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-title></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat router :to="'/app/create'">
            Create
            <v-icon right>add</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list two-line>
          <template v-for="obj in data">
            <v-list-tile :key="obj.app._id" @click="navigate('/form/' + obj.app._id)">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{obj.app.name}}
                </v-list-tile-title>
                <v-list-tile-sub-title>{{obj.app.createdAt | date}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn color="grey lighten-1" @click.stop="onViewSubmissions(obj.app)" flat v-if="obj.roles.some(r => r === 'admin' || r === 'user' || r === 'approver')"><v-icon>view_list</v-icon> Submissions</v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn color="grey lighten-1" @click.stop="onEdit(obj.app)" flat v-if="obj.roles.indexOf('admin') > -1"><v-icon>edit</v-icon> Edit</v-btn>
              </v-list-tile-action>
              <v-list-tile-action>
                <v-btn color="grey lighten-1" @click.stop="onDelete(obj.app)" flat v-if="obj.roles.indexOf('admin') > -1"><v-icon>delete_forever</v-icon> Delete</v-btn>
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
      data: [],
      loading: false
    }
  },
  created () {
    this.loading = false
    axios.get('/user/apps')
    .then((result) => {
      this.data = result.data
      console.log(this.apps)
    })
    .catch(err => {
      this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
    })
    .finally(() => {
      this.loading = false
    })
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    onEdit (app) {
      this.$router.push('app/edit/' + app._id)
    },
    onViewSubmissions (app) {
      this.$router.push('submissions/' + app._id)
    },
    onDelete (app) {
      var _this = this
      this.$root.$confirm('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {
        if (confirm) {
          axios.delete('apps/' + app.app._id)
          .then(result => {
            _this.apps.splice(_this.apps.indexOf(app), 1)
            this.$notify({type: 'success', text: 'App Deleted!', group: 'success'})
          })
          .catch(err => {
            this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
          })
          .finally(() => {

          })
        }
      })
    },
    navigate (path) {
      this.$router.push(path)
    }
  }
}
</script>
