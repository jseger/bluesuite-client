<template>
  <v-tabs id="mobile-tabs-5" v-model="tab" fixed icons grow v-if="!loading">
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
          FORM BUILDER
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
          <form-builder :form="app.form" :workflow="app.workflow"></form-builder>
        </v-card>
      </v-tabs-content>
      <v-tabs-content id="workflow">
        <v-card flat>
          <workflow-builder :workflow="app.workflow"></workflow-builder>
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
import WorkflowBuilder from './WorkflowBuilder/WorkflowBuilder'

export default {
  props: ['id'],
  data () {
    return {
      app: { },
      tab: ''
    }
  },
  created () {
    var _this = this
    if (this.$route.params.id !== null && this.$route.params.id !== undefined) {
      this.$store.dispatch('fetchApp', {id: this.$route.params.id})
      .then((result) => {
        if (result) {
          _this.app = Object.assign({}, _this.$store.getters.app)
        }
      })
    } else {
      _this.app = {
        name: '',
        form: {
          fields: []
        },
        workflow: {
          allowSaveForm: true,
          allowMultipleSubmissions: true,
          states: [{
            name: 'Submitted',
            userAction: true,
            actionName: 'Submit',
            sendNotificationToCollaborators: true,
            requireApproval: true,
            sendAdditionalNotifications: false,
            sendNotificationToSubmitter: false,
            minimumApprovals: 0,
            alsoNotify: [],
            approvers: [],
            approvedState: 'Approved',
            rejectedState: 'Rejected',
            color: 'blue'
          },
          {
            name: 'Approved',
            userAction: false,
            actionName: 'Approve',
            sendNotificationToCollaborators: false,
            requireApproval: false,
            sendAdditionalNotifications: false,
            sendNotificationToSubmitter: true,
            minimumApprovals: 0,
            alsoNotify: [],
            approvers: [],
            approvedState: '',
            rejectedState: '',
            color: 'green'
          },
          {
            name: 'Rejected',
            userAction: false,
            actionName: 'Reject',
            sendNotificationToCollaborators: false,
            requireApproval: false,
            sendAdditionalNotifications: false,
            sendNotificationToSubmitter: true,
            minimumApprovals: 0,
            alsoNotify: [],
            approvers: [],
            approvedState: '',
            rejectedState: '',
            color: 'red'
          }]
        }
      }
    }
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
    onSave () {
      var _this = this
      this.$store.dispatch('saveApp', this.app)
      .then((result) => {
        if (result) {
          _this.app = Object.assign({}, _this.$store.getters.app)
        }
      })
    }
  },
  components: {
    'form-builder': FormBuilder,
    'workflow-builder': WorkflowBuilder
  }
}
</script>

