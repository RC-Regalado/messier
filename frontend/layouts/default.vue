<template>
  <v-app dark>
    <div class="edit-view">
      <v-progress-linear v-show="loading" class="linear-loader" accent indeterminate></v-progress-linear>
      <header101 :scroll0="notScrolled"></header101>


<!--      <v-navigation-drawer-->
<!--        v-model="drawer"-->
<!--        :mini-variant="miniVariant"-->
<!--        :clipped="clipped"-->
<!--        fixed-->
<!--        app-->
<!--      >-->
<!--        <v-list>-->
<!--          <v-list-item-->
<!--            v-for="(item, i) in items"-->
<!--            :key="i"-->
<!--            :to="item.to"-->
<!--            router-->
<!--            exact-->
<!--          >-->
<!--            <v-list-item-action>-->
<!--              <v-icon>{{ item.icon }}</v-icon>-->
<!--            </v-list-item-action>-->
<!--            <v-list-item-content>-->
<!--              <v-list-item-title v-text="item.title" />-->
<!--            </v-list-item-content>-->
<!--          </v-list-item>-->
<!--        </v-list>-->
<!--      </v-navigation-drawer>-->

      <v-app-bar :clipped-left="clipped" fixed app>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-btn icon @click.stop="miniVariant = !miniVariant">
          <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
        </v-btn>
        <v-btn icon @click.stop="clipped = !clipped">
          <v-icon>mdi-application</v-icon>
        </v-btn>
        <v-btn icon @click.stop="fixed = !fixed">
          <v-icon>mdi-minus</v-icon>
        </v-btn>
        <v-toolbar-title v-text="title" />
        <v-spacer />
        <v-btn icon @click.stop="rightDrawer = !rightDrawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </v-app-bar>

      <main id="main" role="main" @scroll="scrollFunction">
            <messier-main></messier-main>
      </main>

      <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
        <v-list>
          <v-list-item @click.native="right = !right">
            <v-list-item-action>
              <v-icon light> mdi-repeat </v-icon>
            </v-list-item-action>
            <v-list-item-title>Switch drawer (click me)</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
<!--      <drawer></drawer>-->

<!--      <v-snackbar :dismisses-on-action="false"/>-->
    </div>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { checkAuth, checkLastSaved, rebaseSelectedElements } from '@/store/types'

import Header101 from '@/components/designer/header'
import Drawer from '@/components/designer/drawer'
import MessierMain from '@/components/designer/main'

export default {
  name: 'designer',
  components: { Header101, MessierMain, Drawer },
  data: function () {
    return {
      notScrolled: true,

      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  created: function () {
    this.$root.$on('rebaseState', this.rebaseState)
  },
  beforeDestroy: function () {
    this.$root.$off('rebaseState', this.rebaseState)
  },
  computed: {
    ...mapState({
      loading: state => state.app.isLoading
    })
  },
  methods: {
    scrollFunction (e) {
      this.notScrolled = (e.target.scrollTop === 0)
    },
    rebaseState () {
      this.checkAuth()
      this.checkLastSaved()
      this.rebaseSelectedElements()
    },
    ...mapActions([rebaseSelectedElements, checkAuth, checkLastSaved])
  }
}
</script>

<style>
.layout-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.edit-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

#main {
  height: 100%;
  position: relative;
  display: inline-block;
  overflow-y: auto;
  overflow-x: auto;
  flex-grow: 1;
  margin-right: 240px;
}

/* IN DEVICES SMALLER THAN 1024px -> NO DRAWER (so remove margins) */
@media screen and (max-width: 1024px) {
  #main {
    margin: 0;
  }
}

dialog {
  width: 320px !important;
  border: none !important;
  box-shadow: 0 9px 46px 8px rgba(0, 0, 0, .14),
  0 11px 15px -7px rgba(0, 0, 0, .12),
  0 24px 38px 3px rgba(0, 0, 0, .2);
}

dialog, dialog::backdrop {
  animation-name: anim-open;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

@keyframes anim-open {
  0% {
    opacity: 0;
    transform: scale3d(1.1, 1.1, 1);
  }
  100% {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}
</style>

<style scoped>
.linear-loader {
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  height: 2px !important;
  position: absolute !important;
}
</style>
