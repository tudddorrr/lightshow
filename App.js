/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import './shim'

import React, {Component} from 'react'
import { StyleSheet, View, Text, TouchableHighlight, ScrollView } from 'react-native'
import { Client } from 'react-native-lifx'
import SequenceButton from './components/SequenceButton'
import SequenceForm from './components/SequenceForm'
import sequences from './utils/sequences'
import randColour from 'randomcolor'

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)

    this.state = {
      lights: [],
      sequences: sequences,
      showModal: false
    }

    let client = new Client()

    let lights = []
    client.on('light-new', light => {
      // get the state to get the name
      light.getState(err => {
        if(err) {
          console.warn(err)
          return
        }

        lights.push(light)
        this.setState({lights})
      })
    })

    client.init()
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.actionsContainer} style={{flex: 1}}>
          {
            this.state.sequences.map((sequence, index) => {
              return <SequenceButton key={index} sequence={sequence} lights={this.state.lights} />
            })
          }

          {this.state.showModal ? <SequenceForm visible={true} lights={this.state.lights} close={() => this.setState({showModal: false})} save={this.saveSequence.bind(this)} /> : null}
        </ScrollView>

        <TouchableHighlight onPress={() => this.setState({showModal: true})}>
          <Text style={styles.newAction}>+ New Sequence</Text>
        </TouchableHighlight>
      </View>
    )
  }

  saveSequence(sequence) {
    let sequences = this.state.sequences
    sequences.push({
      label: sequence.label,
      colour: randColour(),
      loop: sequence.loop,
      actions: sequence.actions
    })
    this.setState({sequences: sequences, showModal: false})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  newAction: {
    color: '#fff',
    fontSize: 18,
    margin: 4,
    padding: 8
  }
})
