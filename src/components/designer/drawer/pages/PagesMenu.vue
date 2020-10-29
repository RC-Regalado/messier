<template>
  <div id="pages-menu">
    <ul class="pages-list">
      <div v-for="(page, pageIndex) in projectPages" :key="page.id"
           :class="{active: (page.id === activePage.id)}"
           @click="changePageIfNeeded(page)"
      >
        <li v-tooltip.right="{content: page.name, delay: 0}" class="pages-list__item">
          <span class="pages-list-item__start-detail">
            <icon v-if="pageIndex === 0" v-bind="home"
                  :color="(page.id === activePage.id)?'rgba(0,0,0,.87)':'rgba(0,0,0,.54)'">
            </icon>
            <icon v-else v-bind="page"
                  :color="(page.id === activePage.id)?'rgba(0,0,0,.87)':'rgba(0,0,0,.54)'">
            </icon>
          </span>

          <div>
            <span class="pages-list-item__title">{{ page.name }}</span>
            <span class="pages-list-item__subtitle" v-show="(page.id === activePage.id)"
                  :title="page.path">{{ page.path }}</span>
          </div>
          <span class="pages-list-item__end-detail">
            <v-menu
              bottom
              origin="center center"
              transition="scale-transition"
              v-show="(page.id === activePage.id)"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  @click.native="showOptsMenu(page)"
                >
                  <icon v-bind="more_vert"></icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item key="0">
                  <v-btn text @click.native="onSelect(0, pageIndex)">
                    Rename page
                  </v-btn>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item key="1">
                  <v-list-item-title>
                    Duplicate page
                  </v-list-item-title>
                </v-list-item>
                <v-divider></v-divider>
                <v-list-item :disabled="(projectPages.length === 1)">
                  <v-list-item-title>
                    Delete page
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </span>
        </li>
      </div>
    </ul>

    <v-btn class="new-page-btn" @click="_togglePageDialog({isOpen: true, isNew: true})">
      <icon v-bind="add_page"></icon>
    </v-btn>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { duplicatePage, removePage, _changeActivePage, _togglePageDialog, _clearSelectedElements } from '@/store/types'

import assets from '@/assets'

export default {
  name: 'pages-menu',
  computed: mapState({
    activePage: state => state.app.selectedPage || { id: 0 },
    projectPages: state => state ? state.project.pages : []
  }),
  methods: {
    changePageIfNeeded (page) {
      if (page.id !== this.activePage.id) {
        this._clearSelectedElements()
        this._changeActivePage(page)
      }
    },

    showOptsMenu (page) {
      this.changePageIfNeeded(page)
      // this.$refs['menu-' + page.id][0].show()
    },

    onSelect (selected, pageIndex) {
      const EDIT = 0
      const DUPLICATE = 1
      const DELETE = 2

      switch (selected) {
        case EDIT:
          this._togglePageDialog({
            isOpen: true,
            isNew: false
          })
          break
        case DUPLICATE:
          this._clearSelectedElements()
          this.duplicatePage({ page: this.activePage })
          break
        case DELETE: {
          const fallbackPage = this.projectPages[(pageIndex > 0) ? 0 : 1] || null
          this.changePageIfNeeded(fallbackPage)
          this.removePage({ pageIndex })
        }
          break
      }
    },

    ...mapActions([duplicatePage, removePage]),
    ...mapMutations([_clearSelectedElements, _togglePageDialog, _changeActivePage])
  },
  props: {
    home: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.home,
        width: 24,
        height: 24
      })
    },
    page: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.page,
        width: 24,
        height: 24
      })
    },
    more_vert: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.more_vert,
        width: 24,
        height: 24
      })
    },
    add_page: {
      type: Object,
      required: false,
      default: () => ({
        data: assets.add_page,
        width: 24,
        height: 24
      })
    }
  }
}
</script>

<style scoped>
#pages-menu {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: calc(100% - 175px);
  width: 100%;
  position: absolute;
  overflow: visible;
  overflow-y: auto;
}

.pages-list {
  color: rgba(0, 0, 0, 0.87);
  margin: 0;
  padding: 0;
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.75rem;
  list-style-type: none;
}

.pages-list__item {
  padding: 4px 16px;
  overflow: inherit;
  cursor: pointer;

  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 48px;
}

.pages-list-item__start-detail {
  width: 24px;
  height: 24px;
  margin-left: 0;
  margin-right: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.pages-list-item__end-detail {
  width: 24px;
  height: 24px;
  margin-left: auto;
  margin-right: 0;
}

.pages-list-item__title,
.pages-list-item__subtitle {
  width: 115px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pages-list-item__subtitle {
  font-size: 0.76rem;
  margin-bottom: 4px;
  font-weight: 400;
  letter-spacing: 0.04em;
  line-height: 1.25rem;
}

.pages-list-item__title {
  color: rgba(0, 0, 0, .38);
}

.pages-list__item:hover .pages-list-item__title,
.pages-list-item__subtitle {
  color: rgba(0, 0, 0, .54);
}

.active .pages-list__item .pages-list-item__title,
.active .pages-list__item:hover .pages-list-item__title {
  color: rgba(0, 0, 0, .87);
}

.new-page-btn {
  position: fixed;
  left: 92px;
  bottom: 32px;
}
</style>
