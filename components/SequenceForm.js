import React, { useState, useCallback, useContext, useEffect } from 'react'
import { Context } from '../store/store'
import { StyleSheet, View, Modal, Text, TouchableHighlight, ScrollView, TextInput, Switch } from 'react-native'
import Action from './Action'
import theme from '../theme'
import uuid from 'uuid/v4'
import { storeSequences } from '../store/actions'
import randomColor from 'randomcolor'
import AsyncStorage from '@react-native-community/async-storage'

export default props => {
  const { store, dispatch } = useContext(Context)
  const lights = store.lights
  const sequences = store.sequences

  const [label, setLabel] = useState('')
  const [loop, setLoop] = useState(false)
  const [actions, setActions] = useState([])

  useEffect(() => {
    if(props.sequence) {
      setLabel(props.sequence.label)
      setLoop(props.sequence.loop)
      setActions(props.sequence.actions)
    }
  }, [])

  const addAction = useCallback(() => {
    setActions([
      ...actions,
      {
        id: uuid(),
        light: lights[0].label,
        colour: {
          hue: 0,
          saturation: 0,
          brightness: 100,
          kelvin: 2500
        },
        delay: 0,
        transition: 0
      }
    ])
  }, [actions])

  const saveAction = useCallback(action => {
    setActions(actions.map(a => {
      if(action.id === a.id) {
        return action
      } else {
        return a
      }
    }))
  }, [actions])

  const deleteAction = useCallback(action => {
    setActions(actions.filter(a => action.id !== action.id))
  }, [actions])

  const saveSequence = useCallback(() => {
    let newSequences = sequences
    if(props.sequence) newSequences = newSequences.filter(sequence => sequence.id !== props.sequence.id)
    newSequences.push({
      id: props.sequence ? props.sequence.id : uuid(),
      label,
      loop,
      actions,
      tileColour: props.sequence ? props.sequence.tileColour : randomColor(),
      createdDateTime: props.sequence ? props.sequence.createdDateTime : new Date()
    })

    saveSequences(newSequences)

    dispatch(storeSequences(newSequences))

    props.close()
  }, [label, loop, actions])

  const deleteSequence = useCallback(() => {
    let newSequences = sequences
    if(props.sequence) newSequences = newSequences.filter(sequence => sequence.id !== props.sequence.id)
    saveSequences(newSequences)

    dispatch(storeSequences(newSequences))

    props.close()
  }, [label, loop, actions])

  const saveSequences = async sequences => {
    try {
      await AsyncStorage.setItem('sequences', JSON.stringify(sequences))
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={props.visible}
      onRequestClose={() => props.close()}>
      <View style={styles.container}>
        <View style={styles.buttons}>
          <TouchableHighlight onPress={() => props.close()}>
            <Text style={styles.button}>Cancel</Text>
          </TouchableHighlight>

          {props.sequence &&
            <TouchableHighlight onPress={deleteSequence}>
              <Text style={styles.button}>Delete</Text>
            </TouchableHighlight>
          }

          <TouchableHighlight onPress={saveSequence}>
            <Text style={styles.button}>Save</Text>
          </TouchableHighlight>
        </View>

        <View style={styles.nameLoopContainer}>
          <TextInput style={styles.nameInput}
            onChangeText={text => setLabel(text)}
            placeholder='Sequence name'
            value={label}
            underlineColorAndroid={theme.colours.grey1}
            placeholderTextColor={theme.colours.grey1}
          />

          <View style={styles.loopBox}>
            <Text style={styles.sliderLabel}>Loop</Text>
            <Switch 
              onValueChange={loop => setLoop(loop)}
              value={loop}
            />
          </View>
        </View>

        <View style={styles.newAction}>
          <TouchableHighlight onPress={addAction}>
            <Text style={styles.button}>+ New Action</Text>
          </TouchableHighlight>
        </View>

        <ScrollView>
          {actions.map(action => {
            return (
              <Action
                key={action.id}
                action={action}
                lights={lights}
                saveAction={saveAction}
                deleteAction={deleteAction}
              />
            )
          })}
        </ScrollView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg
  },
  buttons: {
    height: theme.sizes.md,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    flex: 1,
    textAlign: 'center',
    fontSize: theme.fonts.md
  },
  nameLoopContainer: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around'
  },
  loopBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  sliderLabel: {
    marginRight: theme.spacing.sm
  },
  nameInput: {
    flex: 2,
    color: 'black',
    fontSize: theme.fonts.lg
  },
  actions: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  newAction: {
    marginTop: theme.spacing.md,
    height: theme.sizes.md,
    flexDirection: 'row',
    justifyContent: 'center'
  }
})