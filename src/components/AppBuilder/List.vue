<template>
  <v-layout row v-if="isAuthenticated">
    <v-flex xs12>
      <v-card>
        <v-toolbar color="light-blue" dark>
          <v-toolbar-title></v-toolbar-title>
          <v-btn flat router :to="'/appBuilder/create'">
            Create
            <v-icon right>add</v-icon>
          </v-btn>
        </v-toolbar>
        <v-list>
          <template v-for="app in apps">
            <v-list-tile v-bind:key="app._id">
              <v-list-tile-content>
                <v-list-tile-title></v-list-tile-title><v-btn color="primary" flat router :to="'/appBuilder/edit/' + app._id">{{app.name}}</v-btn>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn color="error" @click="onDelete(app)" flat><v-icon>delete_forever</v-icon></v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
      apps: []
    }
  },
  created () {
    var _this = this
    this.$store.dispatch('fetchApps')
    .then(result => {
      if (result) {
        _this.apps = _this.$store.getters.apps
      }
    })
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  },
  methods: {
    onDelete (app) {
      var _this = this
      this.$root.$confirm('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {
        if (confirm) {
          _this.$store.dispatch('removeApp', {id: app._id}).then((result) => {
            _this.apps = _this.$store.getters.apps
          })
        }
      })
    }
  }
}
</script>
