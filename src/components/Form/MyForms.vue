<template>
  <v-layout row wrap>
     <v-flex xs12>
      <v-card>
        <v-toolbar class="primary" dark>
          <v-toolbar-title>Forms</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn flat router to="/forms/create">
              <v-icon>add</v-icon>
              Create Form
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-list two-line :v-if="!loading">
          <v-list-tile avatar v-for="form in forms" :key="form.id">
            <v-list-tile-content>
              <v-list-tile-title>{{form.title}}</v-list-tile-title>
              <v-list-tile-sub-title>{{form.description}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-btn @click="onRemoveForm(form.id, form.title)">Remove</v-btn>
            <v-btn router :to="'forms/edit/' + form.id">Edit</v-btn>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data () {
    return { }
  },
  created () {
    this.$store.dispatch('fetchForms')
  },
  computed: {
    forms () {
      return this.$store.getters.forms
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    onRemoveForm (formId, name) {
      this.$dialog.confirm('Are you sure you want to remove this form?\n' + name, {okText: 'Click to Delete', cancelText: 'Cancel', type: 'soft'})
        .then(result => {
          if (result) {
            console.log('Clicked on proceed ' + formId)
            this.$store.dispatch('removeForm', formId)
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>
