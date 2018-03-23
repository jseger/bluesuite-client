<template>
  <v-container>
    <v-layout row v-if="!loading && isAuthenticated">
      <v-flex xs12>
        <v-alert outline color="info" icon="info" :value="true">
          Share this app with users so they can complete the form.
        </v-alert>
        <v-card>
          <v-toolbar color="light-blue lighten-2" dark>
            <v-toolbar-title>Users</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" dialog max-width="400">
              <v-btn flat dark @click="dialog = true" slot="activator"> 
                <v-icon>add</v-icon>
                Add User
              </v-btn>
              <v-card>
                <v-card-text>
                  <v-text-field label="Email" v-model="email" :readonly="this.selectedUserId !== null"></v-text-field>
                  <v-checkbox label="Admin" v-model="selectedRoles" value="admin"></v-checkbox>
                  <v-checkbox label="Approver" v-model="selectedRoles" value="approver"></v-checkbox>
                  <v-checkbox label="User" v-model="selectedRoles" value="user"></v-checkbox>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="save()" color="primary">OK</v-btn>
                    <v-btn @click="cancel()">Cancel</v-btn>
                  </v-card-actions>
                </v-card-text>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-list two-line>
              <v-list-tile v-for="obj in data" v-bind:key="obj.user._id">
                <v-list-tile-content>
                  <v-list-tile-title v-html="obj.user.name"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="obj.user.email"></v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn color="grey lighten-1" @click.stop="editUser(obj)" flat><v-icon>edit</v-icon>{{obj.roles}}</v-btn>
                </v-list-tile-action>
                <v-list-tile-action>
                  <v-btn color="grey lighten-1" @click.stop="removeUser(obj)" flat><v-icon>delete_forever</v-icon></v-btn>
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
  props: ['appId'],
  data () {
    return {
      dialog: false,
      email: '',
      loading: false,
      data: [],
      selectedUserId: null,
      selectedRoles: [],
      roles: [{
        name: 'Admin',
        value: 'admin'
      },
      {
        name: 'User',
        value: 'user'
      },
      {
        name: 'Approver',
        value: 'approver'
      }]
    }
  },
  created () {
    this.loading = true
    axios.get('apps/' + this.appId + '/users')
    .then(result => {
      this.data = result.data
      this.$emit('appUsersLoaded', this.data)
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
    removeUser (obj) {
      var _this = this
      this.$root.$confirm('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {
        if (confirm) {
          this.loading = true
          axios.delete('/apps/' + _this.appId + '/removeUser/' + obj.user._id)
          .then(res => {
            this.data.splice(this.data.indexOf(obj), 1)
            this.$emit('appUsersLoaded', this.data)
            this.$notify({group: 'success', text: 'User removed!', type: 'success'})
          })
          .catch(err => {
            this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
          })
          .finally(() => {
            this.loading = false
          })
        }
      })
    },
    save () {
      var _this = this
      var user = null
      axios.post('/user/search', {
        email: _this.email
      })
      .then(userRes => {
        console.log(userRes)
        user = userRes.data.user
        return axios.post('/apps/' + _this.appId + '/addUser', {
          userId: user._id,
          roles: _this.selectedRoles
        })
      })
      .then(res => {
        var index = this.data.findIndex(d => d.user._id === res.data.user._id)
        if (index > -1) {
          this.data[index] = res.data
        } else {
          this.data.push(res.data)
        }
        this.$emit('appUsersLoaded', this.data)
        this.$notify({group: 'success', text: _this.selectedUserId !== null ? 'User Saved!' : 'User added!', type: 'success'})
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.email = ''
        this.dialog = false
      })
    },
    editUser (obj) {
      this.selectedRoles = obj.roles
      this.email = obj.user.email
      this.selectedUserId = obj.user._id
      this.dialog = true
    },
    cancel () {
      this.email = ''
      this.selectedUserId = null
      this.selectedRoles = []
      this.dialog = false
    }
  }
}
</script>

