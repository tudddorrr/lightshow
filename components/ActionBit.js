import React from 'react'
import { StyleSheet, Text, View, TextInput, Picker, TouchableHighlight, Slider } from 'react-native'
import { hsbToRGB, getLuminosity } from '../utils/colours'

export default class ActionBit extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      light: props.lights[0].label,
      h: 0,
      s: 0,
      b: 100,
      k: 2500,
      delay: null
    }
  }

  render() {
    return (
      <View style={[styles.action, {backgroundColor: 'rgb(' + this.tileColour() + ')'}]}>
        <View>
          <Text style={[styles.heading, {color: this.getTextColour()}]}>Light</Text>
          {
            this.props.action.light ? 
            <Text style={{color: this.getTextColour()}}>{this.props.action.light}</Text>
            :
            <View>
              <Picker style={{color: this.getTextColour()}} selectedValue={this.state.light} onValueChange={val => this.setState({light: val})} mode='dropdown'>
                {
                  this.props.lights.map(light => {
                    return <Picker.Item key={light.label} label={light.label} value={light.label} />
                  })
                }
              </Picker>
            </View>
          }
        </View>

        <View style={styles.colourBit}>
          <Text style={[styles.heading, {color: this.getTextColour()}]}>Colour</Text>
          {
            this.props.action.colour ? 
            <Text style={{color: this.getTextColour()}}>{this.props.action.colour}</Text> 
            :
            <View>
              <Text style={{color: this.getSoftTextColour()}}>Hue</Text>
              {this.slider(h => this.setState({h: Math.round(h)}), 0, 360, this.state.h)}

              <Text style={{color: this.getSoftTextColour()}}>Saturation</Text>
              {this.slider(s => this.setState({s: Math.round(s)}), 0, 100, this.state.s)}

              <Text style={{color: this.getSoftTextColour()}}>Brightness</Text>
              {this.slider(b => this.setState({b: Math.round(b)}), 0, 100, this.state.b)}

              <Text style={{color: this.getSoftTextColour()}}>Kelvin</Text>
              {this.slider(k => this.setState({k: Math.round(k)}), 2500, 9000, this.state.k)}
            </View>
          }
        </View>

        <View>
          <Text style={[styles.heading, {color: this.getTextColour()}]}>After</Text>
          {
            this.props.action.delay ? 
            <Text style={{color: this.getTextColour()}}>{this.props.action.delay}ms</Text>
            :
            <View>
              <TextInput 
                style={{color: this.getTextColour()}} 
                onChangeText={delay => this.setState({delay})} 
                placeholder='Delay (ms relative to first action)'
                value={this.state.delay} 
                keyboardType='numeric' 
                underlineColorAndroid={this.getSoftTextColour()} 
                placeholderTextColor={this.getSoftTextColour()} />
            </View>
          }
        </View>

        {
          this.props.action.light && this.props.action.colour && this.props.action.delay ? 
          <TouchableHighlight onPress={() => this.edit()}>
            <Text style={[styles.actionButton, {color: this.getTextColour()}]}>Edit</Text>
          </TouchableHighlight>
          :
          <TouchableHighlight onPress={() => this.save()}>
            <Text style={[styles.actionButton, {color: this.getTextColour()}]}>Save</Text>
          </TouchableHighlight>
        }
      </View>
    )
  }

  slider(onChange, minVal, maxVal, value) {
    return <Slider 
              style={{marginBottom: 4}} 
              onSlidingComplete={onChange} 
              minimumValue={minVal} 
              maximumValue={maxVal} 
              value={value} 
              minimumTrackTintColor={this.getSoftTextColour()} 
              thumbTintColor={this.getTextColour()} />
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

  save() {
    this.props.save({
      id: this.props.action.id,
      light: this.state.light,
      colour: (this.state.h || 0) + '/' + (this.state.s || 0) + '/' + (this.state.b || 100) + '/' + (this.state.k || 9000),
      delay: this.state.delay,
      tileColour: hsbToRGB(this.state.h || 0, this.state.s || 0, this.state.b || 100)
    })
  }

  edit() {
    this.props.save({
      id: this.props.action.id,
      light: null,
      colour: null,
      delay: null,
      tileColour: hsbToRGB(this.state.h || 0, this.state.s || 0, this.state.b || 100)
    })
  }

  tileColour() {
    return this.props.action.tileColour || hsbToRGB(this.state.h || 0, this.state.s || 0, this.state.b || 100)
  }
}

const styles = StyleSheet.create({
  action: {
    borderWidth: 1,
    borderColor: '#eee',
    marginTop: 8,
    padding: 12
  },
  colourBit: {
    marginVertical: 8
  },
  heading: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  actionButton: {
    flex: 1,
    alignSelf: 'center', 
    marginTop: 8,
    fontWeight: 'bold',
    padding: 4,
  }
})