import React, { useState, useContext, useCallback, useEffect } from 'react'
import { Context } from '../store/store'
import { StyleSheet, Text, View, TouchableHighlight, Dimensions } from 'react-native'
import theme from '../theme'
import { clearTimeouts, addTimeout } from '../store/actions'

export default props => {
  const { store, dispatch } = useContext(Context)
  const lights = store.lights
  const timeouts = store.timeouts

  const [loop, setLoop] = useState(false)
  
  const getLight = label => {
    for(light of lights) {
      if(light.label === label) return light
    }
  }

  const clearOtherTimeouts = light => {
    for(t of timeouts) {
      if(t.light === light && t.sequenceId !== props.sequence.id) {
        clearTimeout(t.timeoutId)
      }
    }
  }

  const go = useCallback(() => {
    const sequence = props.sequence

    sequence.actions.forEach((action, index) => {
      // clear all previous timeouts
      clearOtherTimeouts(action.light)
      dispatch(clearTimeouts(action.light, sequence.id))

      let timeoutId = setTimeout(() => {
        // set the colour
        getLight(action.light).on(Number(action.transition))
        getLight(action.light).color(
          action.colour.hue,
          action.colour.saturation,
          action.colour.brightness,
          action.colour.kelvin,
          action.transition
        )

        // loop it?
        if (sequence.loop && index === sequence.actions.length - 1) {
          setLoop(true)
        }
      }, action.delay)

      dispatch(addTimeout(action.light, sequence.id, timeoutId))
    })
  })

  useEffect(() => {
    if(loop) {
      go()
      setLoop(false)
    }
  }, [loop])

  return (
    <TouchableHighlight
      onPress={() => go()}
      onLongPress={() => props.editSequence(props.sequence)}
    >
      <View style={[styles.button, { backgroundColor: props.sequence.tileColour }]}>
        <Text style={styles.label}>{props.sequence.label}</Text>
      </View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  button: {
    width: Dimensions.get('window').width/3,
    height: Dimensions.get('window').width/3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    color: theme.colours.white,
    fontSize: theme.fonts.md,
    textAlign: 'center'
  }
})
