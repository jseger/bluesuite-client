<template>
<v-container>
  <v-layout row>
    <v-flex xs12>
      <v-alert outline color="info" icon="info" :value="true">
      Editing the workflow after the form is in use can have adverse affects on existig submissions.  Make sure your submissions have been save to data tables before altering the state.
      </v-alert>
      <v-card>
        <v-toolbar color="light-blue lighten-2" dark>
          <v-toolbar-title>Settings</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn flat dark @click="addState"> 
            <v-icon>add</v-icon>
            Add State
          </v-btn>
        </v-toolbar>
        <v-list two-line subheader>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="workflow.allowMultipleSubmissions"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Multiple Submissions</v-list-tile-title>
              <v-list-tile-sub-title>Allow user to submit the form more than once</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
           <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="workflow.allowSaveForm"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Save Form</v-list-tile-title>
              <v-list-tile-sub-title>Allow user to save their progress and submit later</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
  <v-layout row v-for="(state, i) in workflow.states" :key="i">
    <v-flex>
      <v-card>
        <v-toolbar :color="state.color">
          <v-toolbar-title><v-text-field solo
            v-model="state.name"
            required
            label="State Name"></v-text-field></v-toolbar-title>
            <v-spacer></v-spacer>
          <v-btn flat dark @click="removeState(state)"> 
            <v-icon>delete</v-icon>
            Remove State
          </v-btn>
        </v-toolbar>
        <v-list two-line subheader>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="state.userAction"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>User Action</v-list-tile-title>
              <v-list-tile-sub-title>If checked, the user will see a button on the form with the action name</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-icon>font_download</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-text-field label="Action Name" 
              v-model="state.actionName"
              required
              hint="Name to display on buttons">
              </v-text-field>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-icon>color_lens</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-select label="Select Color" 
              v-model="state.color" 
              chips
              combobox
              :items="colors">
                <template slot="item" slot-scope="data">
                  <v-list-tile-content>
                    <v-chip label :color="data.item" :dark="data.item.indexOf('dark') > -1">{{data.item}}</v-chip>
                  </v-list-tile-content>
                </template>
                <template slot="selection" slot-scope="data">
                  <v-chip label :color="data.item" :dark="data.item.indexOf('dark') > -1">{{data.item}}</v-chip>
                </template>
              </v-select>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="state.requireApproval"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Require Approval</v-list-tile-title>
              <v-list-tile-sub-title>Requires the submission to by reviewed.  Once approvals are met, the submission will either move into the specified Approved state or Rejected state</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar v-if="state.requireApproval">
            <v-list-tile-action>
              <v-icon>people</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-select
                  label="Approvers"
                  hint="Approvers get notified when submission enters this state"
                  chips
                  tags
                  prepend-icon=""
                  append-icon=""
                  clearable
                  v-model="state.approvers">
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      close
                      @input="removeEmail(state.approvers, data.item)"
                      :selected="data.selected">
                      <strong>{{ data.item }}</strong>
                    </v-chip>
                  </template>
                </v-select>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar v-if="state.requireApproval">
            <v-list-tile-action>
              <v-icon>done_all</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-text-field type="number" 
              v-model="state.minimumApprovals" 
              label="Minimum number of approvals"
              hint="After the minimum number of approvals is met, the submission will automatically move to the Approved state.  If the submission receives more rejections than appovals, the submission moves to the Rejected state."
              :rules="[() => state.approvers.length >= state.minimumApprovals || 'The number of approvals should not exceed the number of approvers.']" ></v-text-field>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar  v-if="state.requireApproval">
            <v-list-tile-action>
              <v-icon>done</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-select label="Approved State" 
              v-model="state.approvedState"
              item-text="name"
              item-value="name" 
              hint="When the minimum number of approvals are met the submission will enter the selected state"
              :rules="[() => state.approvedState !== state.name || 'You cannot select the current state', () => state.approvedState !== state.rejectedState || 'The approved state and rejected state must be different']"
              combobox
              :items="workflow.states">
              </v-select>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar  v-if="state.requireApproval">
            <v-list-tile-action>
              <v-icon>cancel</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-select label="Rejected State" 
              v-model="state.rejectedState"
              item-text="name"
              item-value="name" 
              hint="When the minimum number of approvals are NOT met the submission will enter the selected state"
              :rules="[() => state.rejectedState !== state.name || 'You cannot select the current state', () => state.approvedState !== state.rejectedState || 'The approved state and rejected state must be different']"
              combobox
              :items="workflow.states">
              </v-select>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="state.sendNotificationToCollaborators"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Send Notifications to Collaborators</v-list-tile-title>
              <v-list-tile-sub-title>Sends a notification to all collaborators</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="state.sendNotificationToSubmitter"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Send Notification to Submitter</v-list-tile-title>
              <v-list-tile-sub-title>Sends a notification to the submitter</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar>
            <v-list-tile-action>
              <v-checkbox v-model="state.sendAdditionalNotifications"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Send Additional Notifications</v-list-tile-title>
              <v-list-tile-sub-title>Sends a notification to the emails below</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile avatar v-if="state.sendAdditionalNotifications">
            <v-list-tile-action>
              <v-icon>send</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-select
                  label="Send notificaitons to"
                  chips
                  tags
                  prepend-icon=""
                  append-icon=""
                  clearable
                  v-model="state.alsoNotify">
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      close
                      @input="removeEmail(state.alsoNotify, data.item)"
                      :selected="data.selected">
                      <strong>{{ data.item }}</strong>
                    </v-chip>
                  </template>
                </v-select>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import axios from 'axios'
import { Swatches } from 'vue-color'
import colors from 'vuetify/es5/util/colors'

export default {
  props: ['workflow'],
  data () {
    return {
      colors: []
    }
  },
  created () {
    for (const key in colors) {
      if (key !== 'shades') {
        var baseColor = key
        if (baseColor.slice(0, 4) === 'deep') {
          baseColor = baseColor.slice(0, 4) + '-' + key.slice(4).toLowerCase()
        } else if (key.slice(0, 8) === 'blueGrey') {
          baseColor = baseColor.slice(0, 4) + '-' + key.slice(4).toLowerCase()
        } else if (key.slice(0, 5) === 'light') {
          baseColor = baseColor.slice(0, 5) + '-' + key.slice(5).toLowerCase()
        }

        for (const subKey in colors[key]) {
          if (subKey !== 'base') {
            this.colors.push(baseColor + ' ' + subKey.slice(0, -1) + '-' + subKey.slice(-1))
          } else {
            this.colors.push(baseColor)
          }
        }
      }
    }
  },
  watch: {
    approverEmail (val) {
      val && this.searchForApprovers(val)
    }
  },
  methods: {
    addState () {
      this.workflow.states.push({
        name: 'State ' + (this.workflow.states.length + 1),
        userAction: true,
        actionName: 'Action ' + (this.workflow.states.length + 1),
        sendNotificationToCollaborators: true,
        requireApproval: true,
        sendAdditionalNotifications: true,
        sendNotificationToSubmitter: true,
        alsoNotify: [],
        approvers: [],
        approvedState: '',
        rejectedState: '',
        color: 'blue'
      })
    },
    removeState (state) {
      this.workflow.states.splice(this.workflow.states.indexOf(state), 1)
    },
    addUser (array, user) {
      array.push(user)
    },
    removeEmail (array, email) {
      array.splice(array.indexOf(email), 1)
    },
    searchForApprovers (v) {
      this.searching = true
      axios.get('/user/search/' + encodeURIComponent(v))
        .then((result) => {
          this.searchApprovers.push(result.data.user)
        })
        .catch(() => { })
        .finally(() => {
          this.searching = false
        })
    }
  },
  components: {
    'swatches-picker': Swatches
  }
}
</script>
