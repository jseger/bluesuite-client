<template>
  <div v-if="!loading">
    <v-tabs id="mobile-tabs-5" v-model="tab" fixed icons grow>
      <v-toolbar color="light-blue" dark>
        <v-toolbar-title>{{app.name}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn flat dark router :to="'form'">
            New
          <v-icon right>add</v-icon>
        </v-btn>
        <v-tabs-bar class="transparent" dark slot="extension">
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tabs-item href="#submissions">
            <v-icon>view_quilt</v-icon>
            Submissions
          </v-tabs-item>
          <v-tabs-item href="#notifications">
            <v-icon>done_all</v-icon>
            Notifications
          </v-tabs-item>
        </v-tabs-bar>
      </v-toolbar>
      <v-tabs-items>
        <v-tabs-content id="submissions">
          <bs-submissions :appId="id"></bs-submissions>
        </v-tabs-content>
        <v-tabs-content id="notifications">
          notifications
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import BsSubmissions from '@/components/AppBuilder/Submissions/Submissions'

export default {
  props: ['id'],
  data () {
    return {
      app: { },
      data: { },
      tab: '',
      busy: false,
      submissionDialog: false,
      submissions: []
    }
  },
  created () {
    this.$store.dispatch('setLoading', true)
    axios.get('/apps/' + this.$route.params.id)
    .then(res => {
      this.app = res.data.app
      console.log(this.app)
      for (let index = 0; index < this.app.form.fields.length; index++) {
        const field = this.app.form.fields[index]
        if (field.type === 'table') {
          this.data[field.name] = []
        } else {
          this.data[field.name] = null
        }
      }
    })
    .catch(err => {
      this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
    })
    .finally(() => {
      this.$store.dispatch('setLoading', false)
    })
  },
  computed: {
    loading: {
      get () {
        return this.$store.getters.loading
      }
    },
    canSave () {
      return this.app.name !== null && this.app.name !== undefined && this.app.name !== ''
    }
  },
  methods: {
    save () {
      var _this = this
      console.log(_this.data)
    },
    newForm () {
      console.log('new form')
      for (let index = 0; index < this.app.form.fields.length; index++) {
        const field = this.app.form.fields[index]
        field.id = this.uuidv4()
        if (field.type === 'table') {
          this.data[field.name] = []
        } else {
          this.data[field.name] = null
        }
      }
    },
    submit (state) {
      this.busy = true
      console.log(this.data)
      axios.post('/submissions', {
        appId: this.app._id,
        data: this.data,
        state: state
      })
      .then(result => {
        this.submissions.push(result.data.submission)
        this.$notify({group: 'success', text: 'Successfully submitted', type: 'success'})
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.busy = false
        this.submissionDialog = false
      })
    }
  },
  components: {
    'bs-submissions': BsSubmissions
  }
}
</script>

