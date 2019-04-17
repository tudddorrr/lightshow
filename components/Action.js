import React from 'react'
import { StyleSheet, Text, View, TextInput, Picker, TouchableHighlight } from 'react-native'
import Slider from '@react-native-community/slider'
import { hsbToRGB, getLuminosity } from '../utils/colours'
import theme from '../theme'

export default class ActionBit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      light: props.lights[0].label,
      h: 0,
      s: 0,
      b: 100,
      k: 2500,
      delay: 0,
      transition: 0,
      editing: true
    }

    this.tileColour = this.tileColour.bind(this)
    this.checkLuminosity = this.checkLuminosity.bind(this)
    this.getTextColour = this.getTextColour.bind(this)
    this.getSoftTextColour = this.getSoftTextColour.bind(this)
    this.setLight = this.setLight.bind(this)
    this.setHue = this.setHue.bind(this)
    this.setSaturation = this.setSaturation.bind(this)
    this.setBrightness = this.setBrightness.bind(this)
    this.setKelvin = this.setKelvin.bind(this)
    this.setDelay = this.setDelay.bind(this)
    this.setTransition = this.setTransition.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
  }

  render() {
    const {
      light,
      h,
      s,
      b,
      k,
      delay,
      transition,
      editing
    } = this.state

    const {
      action,
      lights
    } = this.props

    return (
      <View style={[styles.action, {backgroundColor: 'rgb(' + this.tileColour() + ')'}]}>
        <View>
          <Text style={[styles.heading, {color: this.getTextColour()}]}>Light</Text>
          {!editing
            ? <Text style={{color: this.getTextColour()}}>{action.light}</Text>
            :
            <View>
              <Picker
                style={{color: this.getTextColour()}}
                selectedValue={light}
                onValueChange={this.setLight}
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
          <Text style={[styles.heading, {color: this.getTextColour()}]}>Colour</Text>
          {!editing
            ? <Text style={{color: this.getTextColour()}}>{action.colour}</Text> 
            :
            <View>
              <Text style={{color: this.getSoftTextColour()}}>Hue</Text>
              {this.slider(this.setHue, 0, 360, h)}

              <Text style={{color: this.getSoftTextColour()}}>Saturation</Text>
              {this.slider(this.setSaturation, 0, 100, s)}

              <Text style={{color: this.getSoftTextColour()}}>Brightness</Text>
              {this.slider(this.setBrightness, 0, 100, b)}

              <Text style={{color: this.getSoftTextColour()}}>Kelvin</Text>
              {this.slider(this.setKelvin, 2500, 9000, k)}
            </View>
          }
        </View>

        <View>
          <Text style={[styles.heading, {color: this.getTextColour()}]}>After</Text>
          {!editing
            ? <Text style={{color: this.getTextColour()}}>{action.delay}ms</Text>
            :
            <View>
              <TextInput 
                style={{color: this.getTextColour()}} 
                onChangeText={this.setDelay} 
                placeholder='Delay (ms relative to first action)'
                value={`${delay}`} 
                keyboardType='numeric' 
                underlineColorAndroid={this.getSoftTextColour()} 
                placeholderTextColor={this.getSoftTextColour()} />
            </View>
          }
        </View>

        <View>
          <Text style={[styles.heading, {color: this.getTextColour()}]}>Transition</Text>
          {!editing
            ? <Text style={{color: this.getTextColour()}}>{action.transition}ms</Text>
            :
            <View>
              <TextInput 
                style={{color: this.getTextColour()}} 
                onChangeText={this.setTransition} 
                placeholder='Transition (ms)'
                value={`${transition}`} 
                keyboardType='numeric' 
                underlineColorAndroid={this.getSoftTextColour()} 
                placeholderTextColor={this.getSoftTextColour()} />
            </View>
          }
        </View>

        {!editing
          ?
          <View style={styles.editDeleteWrapper}>
            <TouchableHighlight onPress={this.handleEdit}>
              <Text style={[styles.actionButton, {color: this.getTextColour()}]}>Edit</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.handleDelete}>
              <Text style={[styles.actionButton, {color: this.getTextColour()}]}>Delete</Text>
            </TouchableHighlight>
          </View>
          :
          <TouchableHighlight onPress={this.handleSave}>
            <Text style={[styles.actionButton, {color: this.getTextColour()}]}>Save</Text>
          </TouchableHighlight>
        }
      </View>
    )
  }

  slider(onChange, minVal, maxVal, value) {
    return (
      <Slider 
        onSlidingComplete={onChange} 
        minimumValue={minVal} 
        maximumValue={maxVal} 
        value={value} 
        minimumTrackTintColor={this.getSoftTextColour()} 
        thumbTintColor={this.getTextColour()}
      />
    )
  }

  tileColour() {
    return this.props.action.tileColour || hsbToRGB(this.state.h || 0, this.state.s || 0, this.state.b || 100)
  }

  checkLuminosity() {
    let rgb = this.tileColour()
    let rgbNums = [Number(rgb.split(',')[0]), Number(rgb.split(',')[1]), Number(rgb.split(',')[2])]
    return getLuminosity(rgbNums)
  }

  getTextColour() {
    return this.checkLuminosity() > 186 ? 'rgba(0, 0, 0, 1.0)' : 'rgba(255, 255, 255, 1.0)'
  }

  getSoftTextColour() {
    return this.checkLuminosity() > 186 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'
  }

  setLight(light) {
    this.setState({light})
  }

  setHue(h) {
    this.setState({h: Math.round(h)})
  }

  setSaturation(s) {
    this.setState({s: Math.round(s)})
  }

  setBrightness(b) {
    this.setState({b: Math.round(b)})
  }

  setKelvin(k) {
    this.setState({k: Math.round(k)})
  }

  setDelay(delay) {
    this.setState({delay})
  }

  setTransition(transition) {
    this.setState({transition})
  }

  handleSave() {
    this.setState({
      editing: false
    })

    this.props.handleSave({
      id: this.props.action.id,
      light: this.state.light,
      colour: (this.state.h || 0) + '/' + (this.state.s || 0) + '/' + (this.state.b || 100) + '/' + (this.state.k || 9000),
      delay: this.state.delay || 0,
      transition: this.state.transition || 0,
      tileColour: hsbToRGB(this.state.h || 0, this.state.s || 0, this.state.b || 100)
    })
  }

  handleEdit() {
    this.setState({
      editing: !this.state.editing
    })
  }

  handleDelete() {
    this.props.handleDelete(this.props.action.id)
  }
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
    marginVertical: theme.spacing.sm
  },
  heading: {
    fontSize: theme.fonts.md,
    color: theme.colours.black,
    fontWeight: 'bold',
    marginTop: theme.spacing.small
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
  }
})