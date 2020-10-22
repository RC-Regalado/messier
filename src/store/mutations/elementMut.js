import types from '@/store/types'

const commonElementMutations = {
/**
 * Adds the passed element to the parent.children array
 *
 * @param {object} payload.parent : Parent of the new element
 * @param {object} payload.element : New element to save
 */
  [types.createElement]: function (state, payload) {
    payload.parent.children.push(payload.element)
  },

  /**
 * Updates the passed element with the defined new values
 *
 * @param {object} payload.element : Element to update
 * @param {number|null} [payload.left] : New element's left position
 * @param {number|null} [payload.top] : New element's top position
 * @param {number|string|null} [payload.zIndex] : New element's zIndex order
 * @param {number|string|null} [payload.height] : New element's height
 * @param {number|string|null} [payload.width] : New element's width
 * @param {string|null} [payload.text] : New element's text child
 * @param {object|null} [payload.classes] : New element's classes
 * @param {object|null} [payload.styles] : New element's styles
 * @param {object|null} [payload.attrs] : New element's attributes
 */
  [types.updateElement]: function (state, payload) {
    if ((typeof payload.left !== 'undefined') && (payload.left !== null)) payload.element.left = payload.left
    if ((typeof payload.top !== 'undefined') && (payload.top !== null)) payload.element.top = payload.top
    if ((typeof payload.right !== 'undefined') && (payload.right !== null)) payload.element.right = payload.right
    if ((typeof payload.bottom !== 'undefined') && (payload.bottom !== null)) payload.element.bottom = payload.bottom
    if ((typeof payload.zIndex !== 'undefined') && (payload.zIndex !== null)) payload.element.zIndex = payload.zIndex
    if ((typeof payload.height !== 'undefined') && (payload.height !== null)) payload.element.height = payload.height
    if ((typeof payload.width !== 'undefined') && (payload.width !== null)) payload.element.width = payload.width
    if ((typeof payload.text !== 'undefined') && (payload.text !== null)) payload.element.text = payload.text
    if (payload.classes) payload.element.classes = payload.classes
    if (payload.styles) payload.element.styles = payload.styles
    if (payload.attrs) payload.element.attrs = payload.attrs
  },

  /**
 * Removes the element under the specified index
 * from the passed parent element (or page)
 *
 * @param {object} payload.parent : Parent container (element or page)
 * @param {number} payload.eggIndex : Element's index
 */
  [types.deleteElement]: function (state, payload) {
    payload.parent.children.splice(payload.eggIndex, 1)
  }
}

/*******************************************************************
 * In VUEGG, internal mutations (starting with "_"),
 * won't be taken into consideration for the Undo/Redo functionality.
 * This is a convenience behaviour for certain vuegg workarounds.
 *******************************************************************/
const internalElementMutations = {
/**
 * Resets the selectedElements array
 */
  [types._clearSelectedElements]: function (state) {
    state.app.selectedElements = []
  },

  /**
 * Replaces the selectedElements array with a new array
 *
 * @param {array} elements : selected element
 */
  [types._addSelectedElements]: function (state, elements) {
    state.app.selectedElements = elements
  },

  /**
 * Adds a new element to the selectedElements array
 *
 * @param {object} elem : selected element
 */
  [types._addSelectedElement]: function (state, elem) {
    state.app.selectedElements.push(elem)
  },

  /**
 * Removes an element from the selectedElements array
 *
 * @param {object} elemIndex : Index of the element to remove
 */
  [types._removeSelectedElement]: function (state, elemIndex) {
    state.app.selectedElements.splice(elemIndex, 1)
  }
}

const elementMutations = {
  ...commonElementMutations,
  ...internalElementMutations
}

export default elementMutations
