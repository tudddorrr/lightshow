import React from 'react'
import actionTypes from './actionTypes'

export const initialState = {
  lights: [],
  sequences: [],
  timeouts: []
}

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_LIGHT:
      return {
        ...state,
        lights: [
          ...state.lights,
          action.payload
        ]
      }
    case actionTypes.ADD_TIMEOUT_FOR_LIGHT:
      return {
        ...state,
        timeouts: [
          ...state.timeouts,
          action.payload
        ]
      }
    case actionTypes.CLEAR_TIMEOUTS_FOR_LIGHT:
      return {
        ...state,
        timeouts: state.timeouts.filter(t => t.sequenceId !== action.payload.sequenceId && t.light !== action.payload.light)
      }
    case actionTypes.STORE_SEQUENCES:
      return {
        ...state,
        sequences: action.payload
      }
    default:
      return state
  }
}

export const Context = React.createContext()