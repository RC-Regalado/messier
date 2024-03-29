import pageActions from './pageAct'
import elementActions from './elementAct'
import projectActions from './projectAct'

/**
 * Vuex Store Actions
 *
 * @constant
 * @type {object}
 * @see {@link https://vuex.vuejs.org/en/actions.html|Vuex Actions}
 */
const actions = {
  ...projectActions,
  ...pageActions,
  ...elementActions
}

export default actions
