<template>
  <v-tabs id="mobile-tabs-5" fixed icons grow v-if="!loading">
    <v-toolbar color="light-blue">
      <v-text-field solo
        v-model="app.name"
        label="App Name"></v-text-field>
      <v-spacer></v-spacer>
      <v-btn flat dark @click="onSave" :disabled="!canSave">
          Save
        <v-icon right>save</v-icon>
      </v-btn>
      <v-tabs-bar class="transparent" dark slot="extension">
        <v-tabs-slider color="primary"></v-tabs-slider>
        <v-tabs-item href="#forms">
          <v-icon>view_quilt</v-icon>
          Form
        </v-tabs-item>
        <v-tabs-item href="#workflow">
          <v-icon>done_all</v-icon>
          Workflow
        </v-tabs-item>
        <v-tabs-item href="#submissions">
          <v-icon>playlist_add_check</v-icon>
          Submissions
        </v-tabs-item>
        <v-tabs-item href="#data">
          <v-icon>view_list</v-icon>
          Data
        </v-tabs-item>
        <v-tabs-item href="#reports">
          <v-icon>description</v-icon>
          Reports
        </v-tabs-item>
        <v-tabs-item href="#collaborators">
          <v-icon>people</v-icon>
          Collaborators
        </v-tabs-item>
        <v-tabs-item href="#users">
          <v-icon>people_outline</v-icon>
          Users
        </v-tabs-item>
      </v-tabs-bar>
    </v-toolbar>
    <v-tabs-items>
      <v-tabs-content id="forms">
        <v-card flat>
          <form-builder></form-builder>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="workflow">
        <v-card flat>
          <v-card-text>worflow</v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="submissions">
        <v-card flat>
          <v-card-text>submissions</v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="data">
        <v-card flat>
          <v-card-text>data</v-card-text>
        </v-card>
      </v-tabs-content>
        <v-tabs-content id="reports">
        <v-card flat>
          <v-card-text>reports</v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="collaborators">
        <v-card flat>
          <v-card-text>collaborators</v-card-text>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="users">
        <v-card flat>
          <v-card-text>users</v-card-text>
        </v-card>
      </v-tabs-content>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import FormBuilder from './FormBuilder/FormBuilder'

export default {
  props: ['id'],
  data () {
    return {
      model: { }
    }
  },
  created () {
    if (this.$route.params.id !== null && this.$route.params.id !== undefined) {
      this.$store.dispatch('fetchApp', {id: this.$route.params.id})
    }
  },
  computed: {
    app: {
      get () {
        return this.$store.getters.app
      }
    },
    loading: {
      get () {
        return this.$store.getters.loading
      }
    },
    canSave () {
      const app = this.$store.getters.app
      return app.name !== null && app.name !== undefined && app.name !== ''
    }
  },
  methods: {
    onSave () {
      this.$store.dispatch('saveApp', this.app)
    }
  },
  components: {
    'form-builder': FormBuilder
  }
}
</script>

