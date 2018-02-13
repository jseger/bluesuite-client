<template>
  <v-layout row>
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
            <v-list-tile v-bind:key="app.id" router :to="'/appBuilder/edit/' + app.id">
              <v-list-tile-content>
                <v-list-tile-title v-html="app.name"></v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('fetchApps')
  },
  computed: {
    apps () {
      return this.$store.getters.apps
    }
  }
}
</script>
