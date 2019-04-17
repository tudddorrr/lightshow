import React from 'react'
import { StyleSheet, View, Modal, Text, TouchableHighlight, ScrollView, TextInput, Switch } from 'react-native'
import Action from './Action'
import theme from '../theme'
import uuid from 'uuid/v4'

export default class SequenceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      label: null,
      loop: false,
      actions: []
    }

    this.handleNameInput = this.handleNameInput.bind(this)
    this.handleLoop = this.handleLoop.bind(this)
    this.newAction = this.newAction.bind(this)
    this.saveAction = this.saveAction.bind(this)
    this.deleteAction = this.deleteAction.bind(this)
  }

  render() {
    const {
      label,
      loop,
      actions
    } = this.state

    const {
      visible,
      close,
      save,
      lights
    } = this.props

    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={visible}
        onRequestClose={() => {
          close()
        }}>
        <View style={styles.container}>
          <View style={styles.buttons}>
            <TouchableHighlight onPress={() => close()}>
              <Text style={styles.button}>Close</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={this.newAction}>
              <Text style={styles.button}>+ New Action</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => save(this.state)}>
              <Text style={styles.button}>Done</Text>
            </TouchableHighlight>
          </View>

          <View style={styles.nameLoopContainer}>
            <TextInput style={styles.nameInput}
              onChangeText={this.handleNameInput}
              placeholder='Sequence name'
              value={label}
              underlineColorAndroid={theme.colours.grey1}
              placeholderTextColor={theme.colours.grey1}
            />

            <View style={styles.loopBox}>
              <Text style={styles.sliderLabel}>Loop</Text>
              <Switch 
                onValueChange={this.handleLoop}
                value={loop}
              />
            </View>
          </View>

          <ScrollView>
            {actions.map(action => {
              return (
                <Action
                  key={action.id}
                  action={action}
                  lights={lights}
                  handleSave={this.saveAction}
                  handleDelete={this.deleteAction}
                />
              )
            })}
          </ScrollView>
        </View>
      </Modal>
    )
  }

  handleNameInput(label) {
    this.setState({ label })
  }

  handleLoop(loop) {
    this.setState({ loop })
  }

  newAction() {
    let actions = this.state.actions

    actions.push({
      id: uuid()
    })

    this.setState({ actions })
  }

  saveAction(action) {
    let actions = this.state.actions

    actions.forEach(a => {
      if (a.id === action.id) {
        a.light = action.light
        a.colour = action.colour
        a.delay = action.delay,
        a.transition = action.transition,
        a.tileColour = action.tileColour
      }
    })

    this.setState({ actions })
  }

  deleteAction(id) {
    this.setState({
      actions: this.state.actions.filter(a => a.id !== id)
    })
  }
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
    height: theme.sizes.md,    
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
  }
})