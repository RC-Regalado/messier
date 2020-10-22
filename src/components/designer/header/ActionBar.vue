<template>
  <div class="action-bar__wrapper">
    <button v-if="isSyncing" title="syncing" :disabled="true" class="action-btn syncing">
      <icon :data="assets.sync" width="24" height="24" color="rgba(0,0,0,.38)"></icon>
    </button>

    <button v-tooltip="'Undo'" class="action-btn" :disabled="!canUndo" @click="$root.$emit('undo')">
      <icon :data="assets.undo" width="24" height="24"
            :color="canUndo ? '#2b6a73' : 'rgba(0,0,0,.38)'">
      </icon>
    </button>

    <button v-tooltip="'Redo'" class="action-btn" :disabled="!canRedo" @click="$root.$emit('redo')">
      <icon :data="assets.redo" width="24" height="24"
            :color="canRedo ? '#2b6a73' : 'rgba(0,0,0,.38)'">
      </icon>
    </button>

    <!--    <router-link :to="{name: 'preview'}">-->
    <!--      <button v-tooltip="'Preview'" class="action-btn">-->
    <!--        <icon icon="system/actions/preview" width="24" height="24" color="#2b6a73"></icon>-->
    <!--      </button>-->
    <!--    </router-link>-->

    <div class="separator"></div>

    <button v-tooltip="'Clear project'" class="action-btn"
            :disabled="isLoading" @click="$root.$emit('open-confirm-dialog')">
      <icon :data="assets.a_delete" width="24" height="24" color="#2b6a73"></icon>
    </button>

    <!--    <a>Hello</a>-->
    <v-row>
      <v-menu
        bottom
        origin="center center"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            v-tooltip="'Abrir...'"
          >
            <icon :data="assets.folder" width="32" heigth="32" color="#2b6a73"></icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item disabled key="0">
            <v-list-item-title>
              Open project:
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item key="1">
            <v-file-input
              type="file"
              ref="inputOpenLocal"
              @change="openLocalFile"
              accept=".mm"
            />
          </v-list-item>
        </v-list>
      </v-menu>
      <v-menu
        bottom
        origin="center left"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            v-tooltip="'Descargar...'"
          >
            <icon :data="assets.download" width="24" height="24" color="#2b6a73"></icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item disabled key="0">
            <v-list-item-title>
              Descargar
            </v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item key="1">
            <v-btn text v-on:click="this.downloadProject">
              Project (.mm)
            </v-btn>
          </v-list-item>
          <v-list-item key="2">
            <v-btn text v-on:click="this.downloadVueSources">
              Vue sources (.zip)
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-row>

    <button v-tooltip="saveBtnTitle" class="action-btn" @click="$root.$emit('open-upload-dialog')"
            :disabled="!isLoggedIn || !hasChanges || (isLoggedIn && isLoading)"
    >
      <icon :data="assets.cloud_off" v-if="!isLoggedIn"
            width="24" height="24" color="rgba(0,0,0,.38)">
      </icon>
      <icon :data="assets.cloud_up" v-else-if="hasChanges"
            width="24" height="24" color="#2b6a73">
      </icon>
      <icon :data="assets.cloud_done" v-else
            width="24" height="24" color="rgba(0,0,0,.38)">
      </icon>
    </button>

    <div class="separator"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { downloadProject, downloadVueSources, loadVueProject } from '@/store/types'
import assets from '@/assets'

export default {
  name: 'action-bar',
  data: function () {
    return {
      fileValue: null,
      assets: assets
    }
  },
  props: {
    value: {
      type: [String, Object]
    }
  },
  computed: {
    saveBtnTitle () {
      return !this.isLoggedIn
        ? 'Login with Github to save project'
        : this.hasChanges
          ? 'Save in GitHub'
          : 'Nothing to save'
    },
    ...mapState({
      isLoading: state => state.app.isLoading,
      isSyncing: state => state.app.isSyncing,
      hasChanges: state => state.app.hasChanges,
      canUndo: state => state.app.canUndo,
      canRedo: state => state.app.canRedo,
      isLoggedIn: state => state.oauth.isAuthorized
    })
  },
  methods: {
    test () {
      console.log('C++')
    },
    onSelectLoadFrom (selected) {
      const PC = 1
      const GITHUB = 2

      switch (selected.index) {
        case GITHUB:
          this.$root.$emit('open-load-dialog')
          break
        case PC:
          this.fileValue = null
          this.$refs.inputOpenLocal.click()
          break
      }
    },
    openLocalFile (file) {
      // const file = event.file
      if (!file) return

      const reader = new FileReader()
      reader.onload = e => this.loadVueProject({
        origin: 'pc',
        content: e.target.result
      })
      reader.readAsText(file)
    },
    ...mapActions([downloadProject, downloadVueSources, loadVueProject])
  }
}
</script>

<style scoped>
.action-bar__wrapper {
  height: 100%;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-self: stretch;
  align-items: center;
  box-sizing: border-box;
}

.action-btn {
  height: 36px;
  width: 36px;
  min-width: 28px;
  min-height: 28px;
  padding: 1px;
  margin: 0 6px;
  border-radius: 100%;

  background-color: transparent;
  border: 0 none;
  user-select: none;
  outline: none;
}

.action-btn:hover {
  background-color: rgba(43, 106, 115, 0.038);
}

.action-btn:active {
  background-color: rgba(43, 106, 115, 0.38);
}

.action-btn * {
  vertical-align: middle;
}

.mdc-menu-item input {
  display: none;
}

.separator {
  width: 1px;
  height: 16px;
  margin: 0 6px;
  background-color: rgba(0, 0, 0, 0.12);
}

.syncing {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

</style>
