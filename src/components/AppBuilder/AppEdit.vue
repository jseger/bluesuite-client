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
        <v-tabs-item href="#users">
          <v-icon>people_outline</v-icon>
          Users
        </v-tabs-item>
      </v-tabs-bar>
    </v-toolbar>
    <v-tabs-items>
      <v-tabs-content id="forms">
        <form-builder ref="formBuilder" :form="app.form" :workflow="app.workflow"></form-builder>
      </v-tabs-content>
      <v-tabs-content id="workflow">
        <workflow-builder :workflow="app.workflow" :users="appUsers" :approvers="approvers"></workflow-builder>
      </v-tabs-content>
      <v-tabs-content id="submissions">
        <submissions :appId="id"></submissions>
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
      <v-tabs-content id="users">
        <app-users :appId="app._id" v-on:appUsersLoaded="users => onUsersLoaded(users)"></app-users>
      </v-tabs-content>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import axios from 'axios'
import FormBuilder from './FormBuilder/FormBuilder'
import WorkflowBuilder from './WorkflowBuilder/WorkflowBuilder'
import Submissions from '@/components/AppBuilder/Submissions/Submissions'
import Collaborators from './Collaborators/Collaborators'
import AppUsers from './AppUsers'

export default {
  props: ['id'],
  data () {
    return {
      app: { },
      roles: ['admin'],
      tab: '',
      loading: false,
      appUsers: [],
      approvers: []
    }
  },
  created () {
    if (this.$route.params.id !== null && this.$route.params.id !== undefined) {
      this.loading = true
      axios.get('apps/' + this.$route.params.id)
      .then(result => {
        this.app = result.data.app
        this.roles = result.data.roles
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.loading = false
      })
    } else {
      this.app = {
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
            adminAction: false,
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
            color: 'blue',
            adminCanEdit: false,
            userCanEdit: true
          },
          {
            name: 'Approved',
            userAction: false,
            adminAction: true,
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
            color: 'green',
            dminCanEdit: false,
            userCanEdit: false
          },
          {
            name: 'Rejected',
            userAction: false,
            adminAction: true,
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
            color: 'red',
            adminCanEdit: false,
            userCanEdit: true
          }]
        }
      }
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    canSave () {
      return this.app.name !== null && this.app.name !== undefined && this.app.name !== ''
    }
  },
  methods: {
    onSave () {
      var _this = this
      this.loading = true
      if (_this.app._id !== undefined) {
        axios.patch('/apps/' + _this.app._id, _this.app)
        .then((result) => {
          _this.app = result.data.app
          _this.$notify({group: 'success', text: 'App Saved!', type: 'success'})
        })
        .catch((err) => {
          _this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
        })
        .finally(() => {
          _this.loading = false
        })
      } else {
        axios.post('/apps/', _this.app)
        .then((result) => {
          _this.app = result.data.app
          _this.$notify({group: 'success', text: 'App Saved!', type: 'success'})
        })
        .catch((err) => {
          _this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
        })
        .finally(() => {
          _this.loading = false
        })
      }
    },
    onUsersLoaded (users) {
      this.appUsers = users
      this.approvers = users.filter(u => u.roles.some(r => r === 'approver'))
    }
  },
  components: {
    'form-builder': FormBuilder,
    'workflow-builder': WorkflowBuilder,
    'collaborators': Collaborators,
    'app-users': AppUsers,
    'submissions': Submissions
  }
}
</script>

