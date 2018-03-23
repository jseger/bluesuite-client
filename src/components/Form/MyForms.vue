<template>
<v-container>
  <v-layout row wrap v-if="!loading">
     <v-flex sm12 md6 lg4 v-for="app in apps" :key="app._id">
      <v-card class="ma-5 elevation-16">
        <v-card-media style="pointer-events: none;" height="100px">
          <bs-form-component :app="app.app" :disabled="true" style="pointer-events: none;"></bs-form-component>
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <h3 class="headline mb-0">{{app.name}}</h3>
            <div></div>
          </div>
        </v-card-title>
        <v-card-actions>
          <v-btn flat color="blue" :to="'/form/' + app._id">New</v-btn>
          <v-btn flat color="blue" :to="'/form/' + app._id">Saved</v-btn>
          <v-btn flat color="blue">Submissions</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
  <v-progress-linear indeterminate v-bind:size="250" color="primary" v-if="loading"></v-progress-linear>
</v-container>
</template>

<script>
import axios from 'axios'
import FormComponent from '@/components/Form/FormComponent'

export default {
  data () {
    return {
      apps: [],
      loading: false
    }
  },
  created () {
    this.loading = true
    axios.get('/user/apps')
      .then((result) => {
        this.apps = result.data.apps
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.loading = false
      })
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
  },
  components: {
    'bs-form-component': FormComponent
  }
}
</script>
