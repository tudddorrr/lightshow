import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../store/store'
import { addLight, storeSequences } from '../store/actions'
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native'
import { Client } from 'react-native-lifx'
import Sequence from './Sequence'
import SequenceForm from './SequenceForm'
import theme from '../theme'
import AsyncStorage from '@react-native-community/async-storage'

export default () => {
  const { store, dispatch } = useContext(Context)
  const sequences = store.sequences

  const [showModal, setShowModal] = useState(false)
  const [editingSequence, setEditingSequence] = useState(null)

  const getSequences = async () => {
    try {
      const value = await AsyncStorage.getItem('sequences')
      if(value !== null) dispatch(storeSequences(JSON.parse(value)))
    } catch(e) {
      console.warn(e)
    }
  }

  useEffect(() => {
    getSequences()
  }, [])

  useEffect(() => {
    if(!showModal) {
      setEditingSequence(false)
    }
  }, [showModal])

  useEffect(() => {
    if(editingSequence) {
      setShowModal(true)
    }
  }, [editingSequence])

  useEffect(() => {
    let client = new Client()
    client.on('light-new', light => {
      light.getState(err => {
        if (err) {
          console.warn(err)
          return
        }
        dispatch(addLight(light))
      })
    })

    client.init()
  }, [])

  const sortedSequences = sequences.sort((a, b) => {
    return new Date(b.createdDateTime) - new Date(a.createdDateTime)
  })

  return (
    <View style={styles.container}>
      <View style={styles.actionsContainer}>
        {sortedSequences.map(sequence => {
          return (
            <Sequence
              key={sequence.id}
              sequence={sequence}
              editSequence={sequence => setEditingSequence(sequence)}
            />
          )
        })}
      </View>

      {showModal &&
        <SequenceForm
          sequence={editingSequence}
          visible={true}
          close={() => setShowModal(false)}
        />
      }

      <TouchableHighlight onPress={() => setShowModal(true)}>
        <Text style={styles.newAction}>+ New Sequence</Text>
      </TouchableHighlight>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing.lg
  },
  newAction: {
    color: theme.colours.black,
    fontSize: theme.fonts.md,
    marginBottom: theme.spacing.lg,
  }
})
