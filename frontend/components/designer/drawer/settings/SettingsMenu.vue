<template>
  <div class="menus-wrapper">
    <div class="selection-title__wrapper" :title="selectionTitle">
      <icon :icon="'system/elements/'+selectionIcon" width="22" height="22" :original="true" />
      <span class="selection-title">{{ selectionTitle }}</span>
    </div>

    <page-settings
      v-if="(selectionType === 'page')"
      :height="height"
      :width="width"
      :styles="styles"
      @propchange="onPropChange"
    />

    <global-settings
      v-if="(selectionType === 'global')"
      :z-index="zIndex"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      @propchange="onPropChange"
    />

    <component-settings
      v-if="(selectionType === 'component' || selectionType === 'multiple')"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      :z-index="zIndex"
      :height="height"
      :width="width"
      :styles="styles"
      @propchange="onPropChange"
    />

    <element-settings
      v-if="(selectionType === 'element')"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      :z-index="zIndex"
      :height="height"
      :width="width"
      :text="text"
      :styles="styles"
      :attrs="attrs"
      @propchange="onPropChange"
    />

    <mdc-settings
      v-if="(selectionType === 'mdc')"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      :z-index="zIndex"
      :height="height"
      :width="width"
      :text="text"
      :styles="styles"
      :attrs="attrs"
      @propchange="onPropChange"
    />
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import { mapState, mapMutations } from 'vuex'
// import assets from '@/assets'

import PageSettings from './submenus/PageSettings.vue'
import ElementSettings from './submenus/ElementSettings.vue'
import ComponentSettings from './submenus/ComponentSettings.vue'
import MdcSettings from './submenus/MdcSettings.vue'
import GlobalSettings from './submenus/GlobalSettings.vue'
import { updatePage, updateElement } from '@/store/types'

import WebSafeFonts from '@/assets/WebSafeFonts'
// import '@/assets/icons/system/editor/'
// import '@/assets/icons/system/elements/'

export default {
  name: 'SettingsMenu',
  components: { PageSettings, ElementSettings, ComponentSettings, MdcSettings, GlobalSettings },
  data () {
    return {
      text: null,
      height: null,
      width: null,
      top: null,
      left: null,
      bottom: null,
      right: null,
      zIndex: 'auto',
      attrs: {},
      styles: {},
      classes: {},
      webSafeFonts: WebSafeFonts
    }
  },
  computed: {
    selectionTitle () {
      return (this.selectedElements.length === 0)
        ? 'Page'
        : (this.selectedElements.length > 1)
            ? 'Multiple Items'
            : this.selectedElements[0].name
    },
    selectionIcon () {
      return (this.selectedElements.length === 0)
        ? 'page'
        : (this.selectedElements.length > 1)
            ? 'multiple'
            : (this.selectedElements[0].global)
                ? 'globe'
                : (this.selectedElements[0].external)
                    ? 'mdc'
                    : (this.selectedElements[0].componegg)
                        ? 'component'
                        : this.selectedElements[0].name.toLowerCase()
    },
    selectionType () {
      return (this.selectedElements.length === 0)
        ? 'page'
        : (this.selectedElements.length > 1)
            ? 'multiple'
            : (this.selectedElements[0].global)
                ? 'global'
                : (this.selectedElements[0].external)
                    ? 'mdc'
                    : (this.selectedElements[0].componegg)
                        ? 'component'
                        : 'element'
    },
    selectedItem () {
      return (this.selectedElements.length === 0)
        ? this.activePage
        : (this.selectedElements.length > 1)
            ? this.selectedElements
            : this.selectedElements[0]
    },

    ...mapState({
      activePage: state => state.app.selectedPage,
      selectedElements: state => state.app.selectedElements
    })
  },
  methods: {
    onPropChange (changeData) {
      if (changeData.value === '') { return }
      const newValue = {}

      if (
        typeof changeData.value === 'string' && !isNaN(changeData.value) &&
        !changeData.value.includes('%') && changeData.value !== 'auto'
      ) {
        this[changeData.type] = newValue[changeData.type] = parseInt(changeData.value)
      } else {
        this[changeData.type] = newValue[changeData.type] = changeData.value
      }

      this.saveChanges(newValue)
    },

    saveChanges (newValue) {
      if (this.selectionType === 'page') {
        this.updatePage({ page: this.activePage, ...newValue })
      } else if (this.selectionType === 'multiple') {
        this.selectedItem.map(element => this.updateElement({ element, ...newValue }))
      } else {
        this.updateElement({ element: this.selectedItem, ...newValue })
      }
    },

    ...mapMutations([updatePage, updateElement])
  },
  watch: {
    selectedItem (val) {
      if (val !== null) {
        if (Array.isArray(val)) {
          this.text = this.height = this.width = this.top = this.left = this.bottom = this.right = null
          this.attrs = this.styles = this.classes = {}
          this.zIndex = 'auto'
        } else {
          this.text = (val.text) ? val.text : null
          this.height = (typeof val.height !== 'undefined') ? val.height.toString() : null
          this.width = (typeof val.width !== 'undefined') ? val.width.toString() : null
          this.top = (typeof val.top !== 'undefined') ? val.top.toString() : null
          this.left = (typeof val.left !== 'undefined') ? val.left.toString() : null
          this.bottom = (typeof val.bottom !== 'undefined') ? val.bottom.toString() : null
          this.right = (typeof val.right !== 'undefined') ? val.right.toString() : null
          this.zIndex = (typeof val.zIndex !== 'undefined') ? val.zIndex : 'auto'
          this.attrs = (val.attrs) ? cloneDeep(val.attrs) : {}
          this.styles = (val.styles) ? cloneDeep(val.styles) : {}
          this.classes = (val.classes) ? cloneDeep(val.classes) : {}
        }
      }
    }
  },
  props: {

  }
}
</script>

<style>
.menus-wrapper input {
  font-size: .813rem !important;
}
</style>

<style scoped>
.menus-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: calc(100% - 58px);
  width: 100%;
  position: absolute;
  overflow-y: auto;
}

.selection-title__wrapper {
  display: inline-flex;
  user-select: none;
  min-height: 22px;
  max-height: 22px;
  padding: 12px 16px;
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0,0,0,0.12);
}
.selection-title__wrapper svg {
  min-width: 22px;
}
.selection-title {
  padding: 2px 0 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.slider__wrapper svg {
  margin: 12px 0 0 10px;
}
</style>
