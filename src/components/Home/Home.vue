<template>
  <v-container v-if="isAuthenticated">
    Home
  </v-container>
</template>

<script>
export default {
  data () {
    return { }
  },
  created () {

  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>
