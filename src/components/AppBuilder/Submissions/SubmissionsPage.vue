<template>
<div>
  <v-card>
    <v-toolbar color="light-blue" dark>
      <v-btn @click="$router.back()" icon>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>{{appName}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <submissions :appId="appId" v-on:appLoaded="app => appName = app.name"></submissions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
    </v-card>
  <v-progress-linear indeterminate v-bind:size="250" color="primary" v-if="loading"></v-progress-linear>
</div>
</template>

<script>
import Submissions from '@/components/AppBuilder/Submissions/Submissions'

export default {
  props: ['appId'],
  data () {
    return {
      loading: false,
      appName: ''
    }
  },
  components: {
    'submissions': Submissions
  }
}
</script>


