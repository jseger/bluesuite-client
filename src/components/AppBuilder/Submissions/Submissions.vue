<template>
  <div>
    <v-data-table 
    :headers="headers"
    :items="submissions"
    :loading="loading"
    :pagination.sync="pagination"
    :rows-per-page-items="[10, 25, 50, 100, 500]">
      <template slot="items" slot-scope="props">
        <td>{{props.item.submittedBy.name}}</td>
        <td>{{props.item.submittedDate | date}}</td>
        <td>{{props.item.currentState}}</td>
        <td class="text-xs-right">
          <v-btn color="grey lighten-1" flat icon :to="'/form/' + appId + '/' + props.item._id"><v-icon>open_in_new</v-icon></v-btn>
          <v-btn color="grey lighten-1" @click.stop="onDelete(props.item)" flat icon><v-icon>delete_forever</v-icon></v-btn>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  props: ['appId', 'userId'],
  data () {
    return {
      loading: false,
      submissions: [],
      dialog: false,
      data: {},
      roles: null,
      app: null,
      pagination: {
        sortBy: 'submittedDate',
        page: 1,
        rowsPerPage: 100,
        descending: false,
        totalItems: 0
      },
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'submittedBy.name'
        },
        {
          text: 'Date',
          align: 'left',
          sortable: true,
          value: 'submittedDate'
        },
        {
          text: 'State',
          align: 'left',
          sortable: true,
          value: 'currentState'
        },
        {
          text: '',
          sortable: false,
          align: 'left'
        }
      ]
    }
  },
  created () {
    var _this = this
    this.loading = true
    if (this.userId === undefined) {
      axios.get('/apps/' + this.appId + '/submissions/')
      .then(result => {
        _this.submissions = result.data.submissions
        _this.roles = result.data.roles
        _this.app = result.data.app
        this.$emit('appLoaded', _this.app)
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.loading = false
      })
    } else {
      axios.get('/users/' + this.userId + '/submissions/' + this.appId)
      .then(result => {
        _this.submissions = result.data.submissions
      })
      .catch(err => {
        this.$notify({group: 'error', text: err.response.data.message, type: 'error'})
      })
      .finally(() => {
        this.loading = false
      })
    }
  },
  methods: { }
}
</script>

