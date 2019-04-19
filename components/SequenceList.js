import React, { useState, useEffect, useContext } from 'react'
import { Context } from '../store/store'
import { addLight } from '../store/actions'
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native'
import { Client } from 'react-native-lifx'
import Sequence from './Sequence'
import SequenceForm from './SequenceForm'
import theme from '../theme'
import { FlatGrid } from 'react-native-super-grid'

export default () => {
  const { store, dispatch } = useContext(Context)
  const sequences = store.sequences

  const [showModal, setShowModal] = useState(false)
  const [editingSequence, setEditingSequence] = useState(null)

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

  return (
    <View style={styles.container}>
      <FlatGrid
        itemDimension={theme.sizes.xl}
        items={sequences}
        style={styles.actionsContainer}
        renderItem={({ item }) => (
          <Sequence
            sequence={item}
            editSequence={sequence => setEditingSequence(sequence)}
          />
        )}
      />

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
    flex: 1,
    marginTop: theme.spacing.lg
  },
  newAction: {
    color: theme.colours.black,
    fontSize: theme.fonts.md,
    marginBottom: theme.spacing.lg,
  }
})
