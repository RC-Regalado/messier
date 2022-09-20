import types from '@/store/types'
import componentFactory from '@/factories/componentFactory'
import { setElId, getChildNode, calcRelativePoint } from '@/helpers/recursiveMethods'
import { fixElementToParentBounds, getComputedProp } from '@/helpers/positionDimension'

const elementActions = {
/**
 * Register the element (and any childElement contained on it),
 * under the pageId and saves it as a new child on the page.
 *
 * If the element is a component and is added as global (payload.global),
 * or if the component is external (due dependencies), the "component reference" will be saved
 * in the state.project.components array (global component references),
 * and a "component instance" will be registered and saved.
 *
 * (This action assumes that the element is being added to a page)
 *
 * @param {string} payload.pageId : Id of the page where the element is being added
 * @param {object} payload.el : The element that will be added to the page
 * @param {object} payload.global : Whether the component will be added as global or in-line
 *
 * @see {@link [types.createElement]}
 */
  [types.registerElement]: function ({ getters, commit }, payload) {
    const parent = getters.getPageById(payload.pageId)
    let el = payload.el

    if (el.componegg) {
      if (payload.global) {
        el = componentFactory.compInst(payload.el)
        if (!getters.componentExist(el.name)) {
          const componentRef = componentFactory.compRef(payload.el)
          commit(types._saveComponentRef, setElId(componentRef))
        } else {
          const compIndex = getters.getComponentRefIndexByName(el.name)
          const newCount = getters.getComponentRefByIndex(compIndex).usageCount + 1
          commit(types._updateComponentRef, { compIndex, newCount })
        }
      } else if (el.external) {
        // In case the component is from a external library...
        if (!getters.componentExist(el.name)) {
          const componentRef = componentFactory.compRef(payload.el)
          commit(types._saveComponentRef, setElId(componentRef))
        } else {
          const compIndex = getters.getComponentRefIndexByName(el.name)
          const newCount = getters.getComponentRefByIndex(compIndex).usageCount + 1
          commit(types._updateComponentRef, { compIndex, newCount })
        }
      }
    }

    const element = setElId(el, payload.pageId)
    commit(types.createElement, { parent, element })
  },

  /**
 * Removes the element identified by payload.elId from the
 * page (payload.pageId). Notice that the element to remove
 * may not necessarily be a direct children of the page, but sub-(n)-children.
 *
 * @param {string} payload.page : The page where the element exist
 * @param {string} payload.elId : Id of the element to be updated
 * @see {@link [types.deleteElement]}
 */
  [types.removeElement]: function ({ getters, commit }, payload) {
    commit(types._clearSelectedElements)

    const parentId = payload.elId.substring(0, payload.elId.lastIndexOf('.'))
    const parent = getChildNode(payload.page, parentId)
    const eggIndex = parent.children.findIndex(egg => egg.id === payload.elId)

    const element = parent.children[eggIndex]
    if (element.componegg) {
      if (element.global || element.external) {
        const compIndex = getters.getComponentRefIndexByName(element.name)
        const count = getters.getComponentRefByIndex(compIndex).usageCount

        count > 1
          ? commit(types._updateComponentRef, { compIndex, newCount: count - 1 })
          : commit(types._removeComponentRef, compIndex)
      }
    }
    commit(types.deleteElement, { parent, eggIndex })
  },

  /**
 * Updates the element identified by payload.elId with the payload values
 *
 * @param {string} payload.pageId : Id of the page where the element reside
 * @param {string} payload.elId : Id of the element to be updated
 * @param {number} payload.left : New value for the element's left prop
 * @param {number} payload.top : New value for the element's top prop
 * @param {number} payload.height : New value for the element's height
 * @param {number} payload.width : New value for the element's width
 *
 * @see {@link [types.updateElement]}
 */
  [types.resizeElement]: function ({ getters, commit }, payload) {
    const page = getters.getPageById(payload.pageId)
    const element = getChildNode(page, payload.elId)

    if (
      payload.left !== element.left || payload.top !== element.top ||
        payload.right !== element.right || payload.bottom !== element.bottom ||
        payload.height !== element.height || payload.width !== element.width
    ) {
      commit(types.updateElement, {
        element,
        left: (element.left !== 'auto') ? payload.left : null,
        top: (element.top !== 'auto') ? payload.top : null,
        bottom: (element.bottom !== 'auto') ? payload.bottom : null,
        right: (element.right !== 'auto') ? payload.right : null,
        height: (element.height !== 'auto') ? payload.height : null,
        width: (element.width !== 'auto') ? payload.width : null
      })
    }
  },

  /**
 * If payload.parentId != null, meaning that the moved element
 * has been dropped in a new container, the element will change its family.
 *
 * If payload.parentId == null the position of the element
 * identified by payload.elId will be updated.
 *
 * @param {string} payload.pageId : Id of the page where the element exits
 * @param {string} payload.elId : Id of the element to be updated
 * @param {number} payload.left : New value for the element's left prop
 * @param {number} payload.top : New value for the element's top prop
 * @param {number} payload.mouseX : Global mouse position for left axis
 * @param {number} payload.mouseY : Global mouse position for top axis
 * @param {string|null} [payload.parentId] : Id of the container where the element has been dropped
 *
 * @see {@link [types.changeElementParent]}
 * @see {@link [types.updateElement]}
 */
  [types.moveElement]: function ({ getters, dispatch, commit }, payload) {
    const page = getters.getPageById(payload.pageId)
    const element = getChildNode(page, payload.elId)

    if (payload.parentId) {
      dispatch(types.changeElementParent, { ...payload, page, element })
    } else if (payload.left !== element.left || payload.top !== element.top) {
      commit(types.updateElement, {
        element,
        left: (element.left !== 'auto') ? payload.left : null,
        top: (element.top !== 'auto') ? payload.top : null,
        bottom: (element.bottom !== 'auto') ? payload.bottom : null,
        right: (element.right !== 'auto') ? payload.right : null
      })
    }
  },

  /**
 * Changes the payload.element to another family:
 * First removes the element from the children array of it's current (old) parent.
 * Registers the element with the ids of its new family and created as new child
 * on its new parent. After this process, its position/size gets updated.
 *
 * @param {string} payload.pageId : Id of the page where the element exist
 * @param {string} payload.elId : Id of the element to be updated
 * @param {number} payload.left : New value for the element's left prop
 * @param {number} payload.top : New value for the element's top prop
 * @param {number} payload.mouseX : Global mouse position for left axis
 * @param {number} payload.mouseY : Global mouse position for top axis
 * @param {string} payload.parentId : Id of the container where the element has been dropped
 *
 * @see {@link [types.deleteElement]}
 * @see {@link [types.createElement]}
 * @see {@link [types.updateElement]}
 */
  [types.changeElementParent]: function ({ getters, commit }, payload) {
    console.log('Getter: ' + getters)
    // To avoid reference problems (the oldSelected element will be different)
    commit(types._clearSelectedElements)

    // Gets the computed dimensions before being take off the stage
    const height = getComputedProp('height', payload.element)
    const width = getComputedProp('width', payload.element)

    // OLD FAMILY business
    const oldParentId = payload.elId.substring(0, payload.elId.lastIndexOf('.'))
    const oldParent = getChildNode(payload.page, oldParentId)
    const childEggIndex = oldParent.children.findIndex(egg => egg.id === payload.element.id)

    commit(types.deleteElement, { parent: oldParent, eggIndex: childEggIndex })

    // NEW FAMILY business
    const newParent = getChildNode(payload.page, payload.parentId)
    payload.element = setElId(payload.element, payload.parentId)

    commit(types.createElement, { parent: newParent, element: payload.element })

    // Update relative position and dimensions of the element
    const relPoint = calcRelativePoint(payload.page, payload.element.id, payload.mouseX, payload.mouseY)

    const left = relPoint.left - (width / 2)
    const top = relPoint.top - (height / 2)

    const fixedProps = fixElementToParentBounds({ top, left, height, width }, newParent)
    commit(types.updateElement, {
      ...fixedProps,
      element: payload.element,
      bottom: 'auto',
      right: 'auto'
    })
  },

  /**
 * Refetches the elements on the page by the id's of the selectedElements,
 * cleans the selectedElements array and repopulates it with the fresh refetched elements.
 *
 * This is necessary for a correct data binding after redo/undo actions.
 */
  [types.rebaseSelectedElements]: function ({ getters, commit, state }) {
    console.log('Getter: ' + getters)
    const freshElements = state.app.selectedElements.map(el => getChildNode(state.app.selectedPage, el.id))
    commit(types._clearSelectedElements)
    freshElements.map(el => commit(types._addSelectedElement, el))
  }
}

export default elementActions
