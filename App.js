import './shim'

import React, { useReducer } from 'react'
import {
  Context,
  initialState,
  reducer
} from './store/store'
import SequenceList from './components/SequenceList'

export default () => {
  const [store, dispatch] = useReducer(reducer, initialState)

  return (
    <Context.Provider value={{ store, dispatch }}>
      <SequenceList />
    </Context.Provider>
  )
}