<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <v-alert outline color="info" icon="info" :value="true">
          Collaborators have full access to edit forms, submissions, data, and reports.
        </v-alert>
        <v-card>
          <v-toolbar color="light-blue lighten-2" dark>
            <v-toolbar-title>Collaborators</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" dialog max-width="400">
              <v-btn flat dark @click="dialog = true" slot="activator"> 
                <v-icon>add</v-icon>
                Add Collaborator
              </v-btn>
              <v-card>
                <v-card-text>
                  <v-text-field label="Email" v-model="email"></v-text-field>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="addUser()" color="primary">OK</v-btn>
                    <v-btn @click="cancel()">Cancel</v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-list two-line>
              <v-list-tile v-for="user in users" v-bind:key="user._id">
                <v-list-tile-content>
                  <v-list-tile-title v-html="user.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="user.email"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="grey lighten-1" @click.stop="removeUser(user)" flat><v-icon>delete_forever</v-icon></v-btn>
                </v-list-tile-action>
              </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  props: ['users', 'appId'],
  data () {
    return {
      dialog: false,
      email: ''
    }
  },
  created () {
    console.log(this.appId)
  },
  methods: {
    removeUser (user) {
      var _this = this
      this.$root.$confirm('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {
        if (confirm) {
          axios.delete('/apps/' + _this.appId + '/removeCollaborator/' + user._id)
          .then(res => {
            this.users.splice(this.users.indexOf(user), 1)
            this.$notify({group: 'success', text: res.data.message, type: 'success'})
          })
          .catch(err => {
            this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
          })
        }
      })
    },
    addUser () {
      var _this = this
      var user = null
      axios.post('/user/search', {
        email: _this.email
      })
      .then(userRes => {
        console.log(userRes)
        user = userRes.data.user
        return axios.post('/apps/addCollaborator', {
          appId: _this.appId,
          collaboratorId: user._id
        })
      })
      .then(res => {
        this.users.push(user)
        this.$notify({group: 'success', text: res.data.message, type: 'success'})
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.email = ''
        this.dialog = false
      })
    },
    cancel () {
      this.email = ''
      this.dialog = false
    }
  }
}
</script>

