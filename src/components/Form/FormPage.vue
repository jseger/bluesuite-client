<template>
<div>
  <v-card v-if="!loading && isAuthenticated">
    <v-toolbar color="light-blue" dark :extended="currentState !== null">
      <v-btn @click="$router.back()" icon>
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>{{app.name}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-title slot="extension" v-if="submission !== null">State: {{submission.currentState}}</v-toolbar-title>
      <v-spacer slot="extension"></v-spacer>
      <v-btn slot="extension" v-if="currentState.requireApproval && isApprover" flat @click="onApprove()">
        <v-icon>sentiment_very_satisfied</v-icon>
        Approve
      </v-btn>
      <v-btn slot="extension" v-if="currentState.requireApproval && isApprover" flat @click="onReject()">
        <v-icon>sentiment_very_dissatisfied</v-icon>
        Reject
      </v-btn>
      <v-btn slot="extension" v-if="currentState.requireApproval && isApprover" flat @click="onShowHistoryDialog()">
        <v-icon>history</v-icon>
        History
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-container>
        <v-layout row wrap>
          <v-flex v-for="field in app.form.fields" :key="field.id" :class="field.width">
            <v-layout row  style="background-color: white;" class="ma-1">
              <bs-table-field  v-if="field.type === 'table'" 
                :label="field.label" 
                :items="data[field.name]" 
                :columns="field.tableColumns"
                :readonly="!canEdit"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                :required="field.required"
                v-on:itemAdded="item => data[field.name].push(item)"
                v-on:itemRemoved="item => data[field.name].splice(data[field.name].indexOf(item), 1)"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-table-field>
              <bs-checkbox  v-else-if="field.type === 'checkbox'"
                :label="field.label" 
                :required="field.required" 
                :checkState="data[field.name]"
                :readonly="!canEdit"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                v-on:checkStateChanged="checkState => {data[field.name] = checkState}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-checkbox>
              <bs-text-field v-else-if="field.type === 'text'" 
                :label="field.label" 
                :required="field.required"
                :multiLine="field.multiLine"
                :prefix="field.prefix"
                :suffix="field.suffix"
                :readonly="!canEdit"
                :text="data[field.name]" 
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                :alignText="field.alignText"
                v-on:textChanged="text => {data[field.name] = text}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-text-field>
              <bs-number-field v-else-if="field.type === 'number'" 
                :label="field.label" 
                :required="field.required"
                :multiLine="field.multiLine"
                :prefix="field.prefix"
                :suffix="field.suffix" 
                :number="data[field.name]"
                :readonly="!canEdit"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                v-on:numberChanged="number => {data[field.name] = number}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-number-field>
              <bs-date-field v-else-if="field.type === 'date'" 
                :label="field.label" 
                :date="data[field.name]" 
                :name="field.name"
                :width="field.width"
                :readonly="!canEdit"
                :canEditField="false"
                :required="field.required"
                v-on:dateChanged="date => {data[field.name] = date}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-date-field>
              <bs-image-field v-else-if="field.type === 'image'" :image="data[field.name]" 
                :label="field.label" 
                :preview="field.preview"
                :name="field.name"
                :width="field.width"
                :readonly="!canEdit"
                :canEditField="false"
                :required="field.required"
                v-on:imageChanged="image => {data[field.name] = image}" 
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-image-field>
              <bs-radio-button-field v-else-if="field.type === 'radio'"
                :label="field.label" 
                :required="field.required" 
                :horizontal="field.horizontal" 
                :selectedOption="data[field.name]" 
                :options="field.options"
                :readonly="!canEdit"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                v-on:selectionChanged="option => {data[field.name] = option}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-radio-button-field>
              <bs-select-field v-else-if="field.type === 'select'" 
                :label="field.label" 
                :selectedOption="data[field.name]" 
                :options="field.options" 
                :required="field.required"
                :multiple="field.multiple"
                :readonly="!canEdit"
                :name="field.name"
                :width="field.width"
                :canEditField="false"
                v-on:selectionChanged="option => {data[field.name] = option}"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-select-field>
              <bs-label-field v-else-if="field.type === 'label'"
                :label="field.label"
                :width="field.width"
                :icon="field.labelIcon"
                :color="field.labelColor"
                :required="field.required"
                :canEditField="false"
                v-on:fieldChanged="editedField => onFieldChanged(field, editedField)"
                v-on:fieldRemoved="onFieldRemoved(i)"></bs-label-field>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :color="state.color" v-for="(state, i) in app.workflow.states" :key="i" 
          v-if="state.userAction || (state.adminAction && isAdmin)" @click="submit(state.name)" 
          :loading="busy" 
          :disabled="!canEdit && !(state.adminAction && isAdmin)">
          {{state.actionName}}
        </v-btn>
        <v-btn v-if="app.workflow.allowSaveForm" @click="submit('')" :loading="busy" :disabled="!canEdit">Save</v-btn>
        <v-btn @click="onCancel()" :loading="busy" :disabled="!canEdit">Cancel</v-btn>
      </v-card-actions>
  </v-card>
  <v-progress-linear indeterminate v-bind:size="250" color="primary" v-if="loading"></v-progress-linear>
  <v-dialog v-model="historyDialog">
    <v-card>
      <v-toolbar>
        <v-toolbar-title>Approval History</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-list subheader v-for="(s, i) in history" :key="i">
          <v-subheader>{{s.state}} {{s.date | date}}</v-subheader>
          <v-list-tile avatar v-for="(h, j) in s.approvals" :key="j">
            <v-list-tile-avatar>
              <v-icon v-if="h.approved" color="green">sentiment_very_satisfied</v-icon>
              <v-icon v-if="h.rejected" color="red">sentiment_very_dissatisfied</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{h.comment}}</v-list-tile-title>
              <v-list-tile-sub-title>{{h.date | date}} {{h.userId.name}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider></v-divider>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="historyDialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

<script>
import axios from 'axios'
import BsEditFieldDialog from '@/components/AppBuilder/FormBuilder/FieldEditDialog'
import BsTextField from '@/components/AppBuilder/FormBuilder/TextField'
import BsNumberField from '@/components/AppBuilder/FormBuilder/NumberField'
import BsDateField from '@/components/AppBuilder/FormBuilder/DateField'
import BsImageField from '@/components/AppBuilder/FormBuilder/ImageField'
import BsCheckboxField from '@/components/AppBuilder/FormBuilder/CheckboxField'
import BsTabelField from '@/components/Appbuilder/FormBuilder/TableField'
import BsRadioButtonField from '@/components/Appbuilder/FormBuilder/RadioButtonField'
import BsSelectField from '@/components/Appbuilder/FormBuilder/SelectField'
import BsLabelField from '@/components/AppBuilder/FormBuilder/LabelField'

export default {
  props: ['appId', 'submissionId'],
  data () {
    return {
      submission: null,
      data: null,
      app: null,
      appUser: null,
      busy: false,
      loading: false,
      currentState: { },
      historyDialog: false,
      history: []
    }
  },
  created () {
    this.loading = true
    if (this.$route.params.submissionId !== null && this.$route.params.submissionId !== undefined && this.$route.params.submissionId !== '') {
      console.log('getting submission')
      axios.get('submissions/' + this.$route.params.submissionId)
      .then(result => {
        console.log(result)
        this.submission = result.data.submission
        this.data = result.data.submission.data
        this.app = result.data.appUser.app
        this.appUser = result.data.appUser
        this.currentState = this.app.workflow.states.find(s => { return s.name === this.submission.currentState })
        console.log(this.currentState)
        if (this.currentState === null || this.currentState === undefined) {
          this.currentState = {
            requireApproval: false
          }
        }
        for (let index = 0; index < this.submission.stateHistory.length; index++) {
          const element = this.submission.stateHistory[index]
          this.history.push({
            state: element.state,
            date: element.date,
            approvals: this.submission.approvalHistory.filter(a => a.state === element.state && a.sequence === element.sequence)
          })
        }
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.loading = false
      })
    } else {
      axios.get('/apps/' + this.$route.params.appId)
      .then(result => {
        console.log(result.data)
        this.data = { }
        this.app = result.data.app
        this.appUser = result.data
        this.data = { }
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.loading = false
      })
    }
  },
  computed: {
    canEdit () {
      if (this.submission.currentState === '') {
        return true
      }
      if (this.submission === null || this.submission === undefined) {
        return true
      }
      var state = this.app.workflow.states.find(s => { return s.name === this.submission.currentState })
      if (state !== null && state !== undefined) {
        if (this.submission.submittedBy._id === this.$store.getters.user.userId && state.userCanEdit) {
          return true
        }
        if (this.appUser.roles.indexOf('admin') > -1 && state.adminCanEdit) {
          return true
        }
      }
      return false
    },
    canSubmit (state) {
      return state.userAction
    },
    isAdmin () {
      return this.appUser.roles.indexOf('admin')
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    isApprover () {
      console.log(this.appUser)
      console.log(this.currentState.approvers)
      return this.appUser.roles.some(r => r === 'approver') && this.currentState.approvers.some(a => a === this.appUser._id)
    }
  },
  components: {
    'bs-image-field': BsImageField,
    'bs-date-field': BsDateField,
    'bs-text-field': BsTextField,
    'bs-checkbox': BsCheckboxField,
    'bs-number-field': BsNumberField,
    'bs-table-field': BsTabelField,
    'v-edit-field': BsEditFieldDialog,
    'bs-radio-button-field': BsRadioButtonField,
    'bs-select-field': BsSelectField,
    'bs-label-field': BsLabelField
  },
  methods: {
    showDialog (data) {
      this.fields = []
      this.data = data
      for (let index = 0; index < this.app.form.fields.length; index++) {
        const field = this.app.form.fields[index]
        field.id = this.uuidv4()
        this.fields.push(field)
      }
      this.dialog = true
    },
    submit (state) {
      if (this.submissionId === null || this.submissionId === undefined) {
        this.loading = true
        axios.post('/submissions/', {
          data: this.data,
          state: state,
          appId: this.appId
        })
        .then(result => {
          console.log(result)
          this.submission = result.data.submission
          this.data = result.data.submission.data
          this.$notify({group: 'success', text: 'Form ' + (state !== '' ? state : 'saved!'), type: 'success'})
        })
        .catch(err => {
          console.log(err.response.data)
          this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
        })
        .finally(() => {
          this.loading = false
        })
      } else {
        this.loading = true
        if (state === this.submission.currentState) {
          axios.patch('/submissions/' + this.submission._id, {
            data: this.data,
            state: state,
            appId: this.appId
          })
          .then(result => {
            this.submission = result.data.submission
            this.$notify({group: 'success', text: 'Form ' + (state !== '' ? state : 'saved!'), type: 'success'})
          })
          .catch(err => {
            this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
          })
          .finally(() => {
            this.loading = false
          })
        } else {
          axios.post('/submissions/' + this.submission._id + '/changeState', {
            state: state,
            comment: 'Changed state to ' + state
          })
          .then(result => {
            this.submission = result.data.submission
            this.$notify({group: 'success', text: 'Form ' + (state !== '' ? state : 'saved!'), type: 'success'})
          })
          .catch(err => {
            this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
          })
          .finally(() => {
            this.loading = false
          })
        }
      }
    },
    onCancel () {
      this.$router.back()
    },
    onReject () {
      var _this = this
      this.$root.$inputDialog('Reject', 'Please enter reason', { color: 'red' }).then((confirm) => {
        if (confirm.result) {
          _this.loading = true
          axios.post('submissions/' + _this.submission._id + '/reject', {
            comment: confirm.input
          })
          .then(result => {
            this.submission = result.data
            this.history = []
            for (let index = 0; index < this.submission.stateHistory.length; index++) {
              const element = this.submission.stateHistory[index]
              this.history.push({
                state: element.state,
                date: element.date,
                approvals: this.submission.approvalHistory.filter(a => a.state === element.state && a.sequence === element.sequence)
              })
            }
            this.currentState = this.app.workflow.states.find(s => { return s.name === this.submission.currentState })
            this.$notify({type: 'success', text: 'Submission Rejected!', group: 'success'})
          })
          .catch(err => {
            this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
          })
          .finally(() => {
            _this.loading = false
          })
        }
      })
    },
    onApprove () {
      var _this = this
      this.$root.$inputDialog('Approve', 'Comments (optional)', { color: 'green' }).then((confirm) => {
        if (confirm.result) {
          _this.loading = true
          axios.post('submissions/' + _this.submission._id + '/approve', {
            comment: confirm.input
          })
          .then(result => {
            this.submission = result.data
            this.history = []
            for (let index = 0; index < this.submission.stateHistory.length; index++) {
              const element = this.submission.stateHistory[index]
              this.history.push({
                state: element.state,
                date: element.date,
                approvals: this.submission.approvalHistory.filter(a => a.state === element.state && a.sequence === element.sequence)
              })
            }
            this.currentState = this.app.workflow.states.find(s => { return s.name === this.submission.currentState })
            this.$notify({type: 'success', text: 'Submission Approved!', group: 'success'})
          })
          .catch(err => {
            this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
          })
          .finally(() => {
            _this.loading = false
          })
        }
      })
    },
    onShowHistoryDialog () {
      this.historyDialog = true
    }
  }
}
</script>
