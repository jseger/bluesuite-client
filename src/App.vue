<template>
  <v-app>
    <v-navigation-drawer app fixed clipped permanent :mini-variant.sync="mini" v-if="isAuthenticated && !appLoading" width="200">
      <v-list dense>
        <v-list-group no-action>
          <v-list-tile avatar slot="item">
             <v-list-tile-avatar v-if="imageUrl">
                <img v-bind:src="imageUrl">
              </v-list-tile-avatar>
            <v-list-tile-action v-if="!imageUrl">
              <v-icon>person</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{user.name}}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile router :to="'/profile'">
            <v-list-tile-action>
              <v-icon>assignment_ind</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                Edit Profile
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-tile @click="onLogout">
            <v-list-tile-action>
                <v-icon>lock</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  Logout
                </v-list-tile-title>
              </v-list-tile-content>
          </v-list-tile>
        </v-list-group>      
        <v-divider></v-divider>
        <template v-for="menuItem in menuItems">
          <v-list-group v-if="menuItem.menuItems" v-model="menuItem.expanded" :key="menuItem.title" no-action>
            <v-list-tile slot="item">
              <v-list-tile-action>
                <v-icon>{{ menuItem.expanded && menuItem['icon-alt'] ? menuItem['icon-alt'] : menuItem.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ menuItem.title }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="childMenuItem in menuItem.menuItems"
              :key="childMenuItem.title"
              router :to="childMenuItem.href"
            >
              <v-list-tile-action v-if="childMenuItem.icon">
                <v-icon>{{ childMenuItem.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ childMenuItem.title }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile v-else :key="menuItem.title" router :to="menuItem.href">
            <v-list-tile-action>
              <v-icon>{{ menuItem.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ menuItem.title }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app flat clipped v-if="isAuthenticated && !loading">
      <v-toolbar-side-icon @click.stop="mini = !mini"></v-toolbar-side-icon>
      <v-toolbar-title>{{pageTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-toolbar app flat v-if="!isAuthenticated && !appLoading">
      <v-toolbar-title>
        <router-link :to="'/'" style="text-decoration: none;"><img src="@/assets/app-logo-name.png"/></router-link>
      </v-toolbar-title>
       <v-spacer></v-spacer>
      <v-btn round color="primary" class="hidden-sm-and-down" router to="/login" v-if="!isAuthenticated">Login</v-btn>
      <v-btn round color="secondary" class="hidden-sm-and-down" router to="/register" v-if="!isAuthenticated">Sign up</v-btn>
    </v-toolbar>
    <v-content>
      <router-view/>
      <v-progress-linear indeterminate v-bind:size="250" color="primary" v-if="loading"></v-progress-linear>
    </v-content>
    <!-- <v-snackbar :timeout="12000" v-model="notification" :multi-line="true" color="success">{{notificationText}}
      <v-btn flat @click.native="notification = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="12000" v-model="error" :top="true" :multi-line="true" color="error">{{errorText}}
      <v-btn flat @click.native="error = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="12000" v-model="warning" color="warning">{{warningText}}</v-snackbar>
    <v-snackbar :timeout="12000" v-model="info" color="info">{{infoText}}</v-snackbar> -->
    <confirm ref="confirm"></confirm>
    <input-dialog ref="inputDialog"></input-dialog>
    <notifications group="error" position="top center" type="error"/>
    <notifications group="success" position="bottom right" type="success"/>
    <notifications group="warning" position="bottom right" type="warning"/>
    <notifications group="info" position="top right" type="info"/>
    <v-dialog v-model="appLoading" dialog persistent>
      <v-card>
        <v-card-text>
          <div style="text-align: center; height: 300px;">
            <v-progress-circular indeterminate v-bind:size="250" color="primary"></v-progress-circular>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import Confirm from '@/components/Shared/ConfirmDialog'
import InputDialog from '@/components/Shared/InputDialog'

export default {
  data () {
    return {
      title: 'BlueSuite',
      imageUrl: null,
      mini: false,
      menuItems: [
        {
          title: 'My Apps',
          icon: 'view_quilt',
          href: '/myapps'
        }
      ]
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
      .then(() => {
        this.$router.push('/login')
      })
      .catch((err) => {
        console.log(err)
      })
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    hasNotificationsPending () {
      return this.$store.getters.notifications.length > 0
    },
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    },
    pageTitle () {
      return this.$store.getters.pageTitle
    },
    notifications () {
      return this.$store.getters.notifications
    },
    loading () {
      return this.$store.getters.loading
    },
    appLoading () {
      return this.$store.getters.appLoading
    }
  },
  watch: {
    notifications (value) {
      if (this.hasNotificationsPending) {
        this.$notify(this.$store.getters.notifications.shift())
      }
    },
    hasNotificationsPending (value) {
      if (!this.notification && this.hasNotificationsPending) {
        this.notificationText = this.$store.getters.notifications.shift()
        this.$nextTick(() => { this.notification = true })
      }
    }
  },
  components: {
    'confirm': Confirm,
    'input-dialog': InputDialog
  },
  mounted () {
    this.$root.$confirm = this.$refs.confirm.open
    this.$root.$inputDialog = this.$refs.inputDialog.open
  }
}
</script>
