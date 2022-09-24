import newState from '@/factories/stateFactory'

import _getters from './getters'
import _actions from './actions'
import _mutations from './mutations'


/**
 * Vuex Store State
 * (aka. Single State Tree or "single source of truth")
 *
 * (Vue initial store's state)
 *
 * @constant
 * @type {object}
 * @see {@link https://vuex.vuejs.org/en/state.html|Vuex State}
 */

export const state = newState()

export const getters = { ..._getters }
export const mutations = { ..._mutations }
export const actions = { ..._actions }
