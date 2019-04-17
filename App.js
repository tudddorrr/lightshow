import './shim'

import React from 'react'
import { StyleSheet, View, Text, TouchableHighlight, ScrollView } from 'react-native'
import { Client } from 'react-native-lifx'
import SequenceButton from './components/SequenceButton'
import SequenceForm from './components/SequenceForm'
import sequences from './utils/sequences'
import randColour from 'randomcolor'
import theme from './theme'
import { FlatGrid } from 'react-native-super-grid'

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      lights: [],
      sequences,
      showModal: false
    }

    let client = new Client()
    let lights = []

    client.on('light-new', light => {
      light.getState(err => {
        if (err) {
          console.warn(err)
          return
        }

        lights.push(light)
        this.setState({ lights })
      })
    })

    client.init()

    this.handleModal = this.handleModal.bind(this)
    this.saveSequence = this.saveSequence.bind(this)
  }

  render() {
    const { sequences, lights } = this.state

    return (
      <View style={styles.container}>
          <FlatGrid
            itemDimension={130}
            items={sequences}
            style={styles.actionsContainer}
            renderItem={({ item }) => (
              <SequenceButton
                sequence={item}
                lights={lights}
              />
            )}
          />

          {this.state.showModal &&
            <SequenceForm
              visible={true}
              lights={this.state.lights}
              close={this.handleModal}
              save={this.saveSequence}
            />
          }

        <TouchableHighlight onPress={this.handleModal}>
          <Text style={styles.newAction}>+ New Sequence</Text>
        </TouchableHighlight>
      </View>
    )
  }

  handleModal() {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  saveSequence(sequence) {
    let sequences = this.state.sequences
    sequences.push({
      ...sequence,
      colour: randColour(),
    })
    this.setState({ sequences, showModal: false })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colours.black,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  actionsContainer: {
    flex: 1,
    marginTop: theme.spacing.lg
  },
  newAction: {
    color: '#fff',
    fontSize: theme.fonts.md,
    marginBottom: theme.spacing.lg,
  }
})
