import React, { useState, useCallback, useContext, useEffect }  from 'react'
import { Context } from '../store/store'
import { StyleSheet, Text, View, TextInput, Picker, TouchableHighlight } from 'react-native'
import Slider from '@react-native-community/slider'
import { hsbToRGB, getLuminosity } from '../utils/colours'
import theme from '../theme'

export default props => {
  const { store, dispatch } = useContext(Context)
  const lights = store.lights

  const [light, setLight] = useState(null)
  const [hue, setHue] = useState(0)
  const [saturation, setSaturation] = useState(0)
  const [brightness, setBrightness] = useState(100)
  const [kelvin, setKelvin] = useState(2500)
  const [delay, setDelay] = useState(0)
  const [transition, setTransition] = useState(0)
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setLight(props.action.light)
    setHue(props.action.colour.hue)
    setSaturation(props.action.colour.saturation)
    setBrightness(props.action.colour.brightness)
    setKelvin(props.action.colour.kelvin)
    setDelay(props.action.delay)
    setTransition(props.action.transition)
  }, [])

  const slider = (onChange, minVal, maxVal, value) => {
    return (
      <Slider 
        onSlidingComplete={onChange} 
        minimumValue={minVal} 
        maximumValue={maxVal} 
        value={value} 
        minimumTrackTintColor={getSoftTextColour()} 
        thumbTintColor={getTextColour()}
      />
    )
  }

  const tileColour = () => {
    return hsbToRGB(hue, saturation, brightness)
  }

  const checkLuminosity = () => {
    const rgb = tileColour()
    const rgbParts = rgb.split(',')
    const rgbNums = [Number(rgbParts[0]), Number(rgbParts[1]), Number(rgbParts[2])]
    return getLuminosity(rgbNums)
  }

  const getTextColour = () => {
    return checkLuminosity() > 186 ? 'rgba(0, 0, 0, 1.0)' : 'rgba(255, 255, 255, 1.0)'
  }

  const getSoftTextColour = () => {
    return checkLuminosity() > 186 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'
  }

  const saveAction = useCallback(() => {
    setEditing(false)
    props.saveAction({
      id: props.action.id,
      light,
      colour: {
        hue,
        saturation,
        brightness,
        kelvin
      },
      delay: delay || 0,
      transition: transition || 0
    })
  })

  return (
    <View style={[styles.action, {backgroundColor: 'rgb(' + tileColour() + ')'}]}>
      <View>
        <Text style={[styles.heading, {color: getTextColour()}]}>Light</Text>
        {!editing
          ? <Text style={{color: getTextColour()}}>{props.action.light}</Text>
          :
          <View>
            <Picker
              style={{color: getTextColour()}}
              selectedValue={light}
              onValueChange={light => setLight(light)}
              mode='dropdown'>
              {lights.map(light => {
                return (
                  <Picker.Item
                    key={light.label}
                    label={light.label}
                    value={light.label}
                  />
                )
              })}
            </Picker>
          </View>
        }
      </View>

      <View style={styles.colourBit}>
        <Text style={[styles.heading, {color: getTextColour()}]}>Colour</Text>
        {!editing
          ? <Text style={{color: getTextColour()}}>{Object.values(props.action.colour).join('/')}</Text> 
          :
          <View>
            <Text style={{color: getSoftTextColour()}}>Hue</Text>
            {slider(val => setHue(Math.floor(val)), 0, 360, hue)}

            <Text style={{color: getSoftTextColour()}}>Saturation</Text>
            {slider(val => setSaturation(Math.floor(val)), 0, 100, saturation)}

            <Text style={{color: getSoftTextColour()}}>Brightness</Text>
            {slider(val => setBrightness(Math.floor(val)), 0, 100, brightness)}

            <Text style={{color: getSoftTextColour()}}>Kelvin</Text>
            {slider(val => setKelvin(Math.floor(val)), 2500, 9000, kelvin)}
          </View>
        }
      </View>

      <View style={styles.textInput}>
        <Text style={[styles.heading, {color: getTextColour()}]}>After</Text>
        {!editing
          ? <Text style={{color: getTextColour()}}>{props.action.delay}ms</Text>
          :
          <View>
            <TextInput 
              style={{color: getTextColour()}} 
              onChangeText={delay => setDelay(Number(delay))} 
              placeholder='Delay (ms relative to first action)'
              value={`${delay}`} 
              keyboardType='numeric' 
              underlineColorAndroid={getSoftTextColour()} 
              placeholderTextColor={getSoftTextColour()} />
          </View>
        }
      </View>

      <View style={styles.textInput}>
        <Text style={[styles.heading, {color: getTextColour()}]}>Transition</Text>
        {!editing
          ? <Text style={{color: getTextColour()}}>{props.action.transition}ms</Text>
          :
          <View>
            <TextInput 
              style={{color: getTextColour()}} 
              onChangeText={transition => setTransition(Number(transition))} 
              placeholder='Transition (ms)'
              value={`${transition}`} 
              keyboardType='numeric' 
              underlineColorAndroid={getSoftTextColour()} 
              placeholderTextColor={getSoftTextColour()} />
          </View>
        }
      </View>

      {!editing
        ?
        <View style={styles.editDeleteWrapper}>
          <TouchableHighlight onPress={() => setEditing(true)}>
            <Text style={[styles.actionButton, {color: getTextColour()}]}>Edit</Text>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => props.deleteAction(props.action.id)}>
            <Text style={[styles.actionButton, {color: getTextColour()}]}>Delete</Text>
          </TouchableHighlight>
        </View>
        :
        <TouchableHighlight onPress={saveAction}>
          <Text style={[styles.actionButton, {color: getTextColour()}]}>Save</Text>
        </TouchableHighlight>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  action: {
    borderWidth: 1,
    borderColor: theme.colours.grey3,
    marginTop: theme.spacing.sm,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius
  },
  colourBit: {
    marginTop: theme.spacing.md
  },
  heading: {
    fontSize: theme.fonts.md,
    color: theme.colours.black,
    fontWeight: 'bold'
  },
  actionButton: {
    flex: 1,
    alignSelf: 'center', 
    marginTop: theme.spacing.sm,
    fontWeight: 'bold',
    padding: theme.spacing.xs,
    fontSize: theme.fonts.md
  },
  editDeleteWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm
  },
  textInput: {
    marginTop: theme.spacing.md
  }
})