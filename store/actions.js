import actionTypes from './actionTypes'

export const addLight = light => ({
  type: actionTypes.ADD_LIGHT,
  payload: light
})

export const addTimeout = (light, sequenceId, timeoutId) => ({
  type: actionTypes.ADD_TIMEOUT_FOR_LIGHT,
  payload: {
    light,
    sequenceId,
    timeoutId
  }
})

export const clearTimeouts = (light, sequenceId) => ({
  type: actionTypes.CLEAR_TIMEOUTS_FOR_LIGHT,
  payload: {
    light,
    sequenceId
  }
})

export const storeSequences = sequence => ({
  type: actionTypes.STORE_SEQUENCES,
  payload: sequence
})