<template>
  <mr-container
    :id="page.id"
    :zoom="zoom"
    :style="pageStyles"
    :class="[page.classes, {stage: true}]"
    :activeElements="selectedElements"
    @arrows="arrowsHandler"
    @moving="movingHandler"
    @movestop="moveStopHandler"
    @resizestop="resizeStopHandler"
    @selectstop="selectStopHandler"
    @clearselection="clearSelectionHandler"
    @delete="deleteHandler"
    @copy="copyHandler"
    @cut="cutHandler"
    @paste="pasteHandler"
    @drop="dropHandler"
    @undo="$root.$emit('undo')"
    @redo="$root.$emit('redo')"
  >

    <stage-el
      v-for="element in page.children"
      :key="element.id"
      :elem="element">
    </stage-el>

  </mr-container>
</template>

<script>
import cloneDeep from 'clone-deep'
import elementsFromPoint from '@/polyfills/elementsFromPoint'
import { getComputedProp, fixElementToParentBounds } from '@/helpers/positionDimension'

import { mapState, mapActions, mapMutations } from 'vuex'
import {
  _clearSelectedElements, _addSelectedElements, registerElement,
  removeElement, resizeElement, moveElement, rebaseSelectedElements
} from '@/store/types'

import MrContainer from '@/components/designer/common/mr-vue/MrContainer'
import StageEl from './StageEl'

const DROP_BORDER = {
  width: '2px',
  style: 'solid',
  color: '#f1867f'
}

export default {
  name: 'stage',
  components: { StageEl, MrContainer },
  props: ['page', 'zoom'],
  data: function () {
    return {
      clipboard: [],
      dropContainer: null,
      defaultBorder: {
        width: '',
        style: '',
        color: ''
      }
    }
  },
  computed: {
    pageStyles () {
      return {
        ...this.page.styles,
        height: (typeof this.page.height === 'string') ? this.page.height : (this.page.height + 'px'),
        width: (typeof this.page.width === 'string') ? this.page.width : (this.page.width + 'px'),
        transform: 'scale(' + this.zoom + ')'
      }
    },

    ...mapState({
      selectedElements: state => state.app.selectedElements || [],
      projectComponents: state => state.project.components
    })
  },
  methods: {
    clearSelectionHandler () {
      if (this.selectedElements.length > 0) this._clearSelectedElements()
    },

    deleteHandler () {
      if (this.selectedElements.length > 0) {
        this.selectedElements.map(el => this.removeElement({ page: this.page, elId: el.id }))
      }
    },

    copyHandler () {
      if (this.selectedElements.length > 0) {
        this.clipboard = []
        this.selectedElements.map(el => this.clipboard.push(cloneDeep(el)))
      }
    },

    cutHandler () {
      if (this.selectedElements.length > 0) {
        this.clipboard = []
        this.selectedElements.map(el => {
          this.clipboard.push(cloneDeep(el))
          this.removeElement({ page: this.page, elId: el.id })
        })
      }
    },

    pasteHandler () {
      if (this.clipboard.length > 0) {
        this.clipboard.map(el => {
          this.registerElement({ pageId: this.page.id, el, global: el.global })
        })
      }
    },

    dropHandler (e) {
      const mainContainer = document.getElementById('main')
      let element = JSON.parse(e.dataTransfer.getData('text/plain'))

      const height = getComputedProp('height', element, this.page)
      const width = getComputedProp('width', element, this.page)
      this.$el.getAttributeNames()
      let top = e.pageY + mainContainer.scrollTop - mainContainer.offsetTop - this.$el.offsetTop - (height / 2)
      let left = e.pageX + mainContainer.scrollLeft - mainContainer.offsetLeft - this.$el.offsetLeft - (width / 2)

      // Correct drop positions based on the editorZoom
      top = Math.round(top / this.zoom)
      left = Math.round(left / this.zoom)

      const fixedElement = fixElementToParentBounds({ top, left, height, width }, this.page)
      element = { ...element, ...fixedElement }

      this.registerElement({ pageId: this.page.id, el: element, global: e.shiftKey })
    },

    selectStopHandler (selectionBox) {
      if ((selectionBox.top === selectionBox.bottom && selectionBox.left === selectionBox.right) ||
          (this.page.children.length === 0)) return

      const selectedElements = []
      this.page.children.forEach(childEl => {
        const child = (childEl.global) ? { ...childEl, ...this.getComponentRef(childEl), id: childEl.id } : childEl

        const childTop = getComputedProp('top', child, this.page)
        const childLeft = getComputedProp('left', child, this.page)
        const childBottom = getComputedProp('height', child, this.page) + childTop
        const childRight = getComputedProp('width', child, this.page) + childLeft

        if (((childTop <= selectionBox.bottom) && (childLeft <= selectionBox.right) &&
            (childBottom >= selectionBox.top) && (childRight >= selectionBox.left)) ||
            ((childTop <= selectionBox.bottom) && (childRight >= selectionBox.left) &&
            (childBottom >= selectionBox.top) && (childLeft <= selectionBox.right))) {
          selectedElements.push(child)
        }
      })

      if (selectedElements.length > 0) {
        this._addSelectedElements(selectedElements)
      }
    },

    getComponentRef (component) {
      return this.projectComponents[this.projectComponents.findIndex(comp => comp.name === component.name)]
    },

    resizeStopHandler (resStopData) {
      resStopData.map(resElData => this.resizeElement({ ...resElData, pageId: this.page.id }))
      this.rebaseSelectedElements()
    },

    arrowsHandler ({ direction, shiftKey }) {
      if (this.selectedElements.length > 0) {
        const diff = shiftKey ? 10 : 1

        let addedTop = 0
        let addedBottom = 0
        let addedLeft = 0
        let addedRight = 0

        switch (direction) {
          case 'up': addedTop -= diff; addedBottom += diff; addedLeft = addedRight = null; break
          case 'down': addedBottom -= diff; addedTop += diff; addedLeft = addedRight = null; break
          case 'left': addedLeft -= diff; addedRight += diff; addedTop = addedBottom = null; break
          case 'right': addedRight -= diff; addedLeft += diff; addedTop = addedBottom = null; break
        }

        this.selectedElements.map(el => {
          const compTop = getComputedProp('top', el)
          const compBottom = getComputedProp('bottom', el)
          const compLeft = getComputedProp('left', el)
          const compRight = getComputedProp('right', el)

          const top = (addedTop && ((compTop + addedTop) >= 0) && ((compBottom + addedBottom) >= 0))
            ? (compTop + addedTop) : null
          const bottom = (addedBottom && ((compBottom + addedBottom) >= 0) && ((compTop + addedTop) >= 0))
            ? (compBottom + addedBottom) : null
          const left = (addedLeft && ((compLeft + addedLeft) >= 0) && ((compRight + addedRight) >= 0))
            ? (compLeft + addedLeft) : null
          const right = (addedRight && ((compRight + addedRight) >= 0) && ((compLeft + addedLeft) >= 0))
            ? (compRight + addedRight) : null

          if (top || bottom || left || right) {
            this.moveElement({ elId: el.id, pageId: this.page.id, top, bottom, left, right })
          }
        })
        this.rebaseSelectedElements()
      }
    },

    movingHandler (absMouseX, absMouseY) {
      this.dropContainer = this.getContainerOnPoint(absMouseX, absMouseY)
      this.toggleDroppableCursor(!!this.dropContainer)
    },

    moveStopHandler (moveStopData) {
      const container = this.getContainerOnPoint(moveStopData.absMouseX, moveStopData.absMouseY)
      const parentId = container ? container.id : null

      moveStopData.moveElData.map(moveData => this.moveElement({
        ...moveData,
        pageId: this.page.id,
        parentId,
        mouseX: moveStopData.relMouseX,
        mouseY: moveStopData.relMouseY
      }))

      this.rebaseSelectedElements()
      this.toggleDroppableCursor(false)
      this.dropContainer = null
    },

    getContainerOnPoint (x, y) {
      const movingEggs = this.selectedElements
      const parentsIds = movingEggs.map(egg => egg.id.substring(0, egg.id.lastIndexOf('.')))
      const commonParentId = parentsIds.every((val, i, arr) => val === arr[0]) ? parentsIds[0] : null
      const elementsOnPoint = elementsFromPoint(x, y)

      for (const el of elementsOnPoint) {
        if (el.id === commonParentId) return null
        if ((el.dataset.mrContainer) ||
          (
            (el.dataset.container) &&
            (!el.dataset.componegg) &&
            (movingEggs.every(egg => !el.id.includes(egg.id)))
          )
        ) return el
      }
      return null
    },

    toggleDroppableCursor (isDroppable) {
      isDroppable
        ? document.documentElement.classList.add('droppable')
        : document.documentElement.classList.remove('droppable')
    },

    ...mapActions([rebaseSelectedElements, registerElement, removeElement, resizeElement, moveElement]),
    ...mapMutations([_clearSelectedElements, _addSelectedElements])
  },
  watch: {
    dropContainer: function (newVal, oldVal) {
      if (oldVal) {
        oldVal.style.borderWidth = this.defaultBorder.width
        oldVal.style.borderStyle = this.defaultBorder.style
        oldVal.style.borderColor = this.defaultBorder.color
      }

      if (newVal) {
        this.defaultBorder.width = newVal.style.borderWidth
        this.defaultBorder.style = newVal.style.borderStyle
        this.defaultBorder.color = newVal.style.borderColor
        newVal.style.borderWidth = DROP_BORDER.width
        newVal.style.borderStyle = DROP_BORDER.style
        newVal.style.borderColor = DROP_BORDER.color
      }
    }
  }
}
</script>

<style>

</style>
