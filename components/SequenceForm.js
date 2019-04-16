import React from 'react'
import { StyleSheet, View, Modal, Text, TouchableHighlight, ScrollView, TextInput, Switch } from 'react-native'
import ActionBit from './ActionBit'

export default class ActionForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      label: '',
      loop: false,
      actions: []
    }
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.close()
        }}>
        <View style={styles.container}>
          <TextInput style={{color: 'black', marginBottom: 12, fontSize: 28}} 
                       onChangeText={t => this.setState({label: t})} 
                       placeholder='Sequence name'
                       value={this.state.label} 
                       underlineColorAndroid='rgba(0, 0, 0, 0.35)' 
                       placeholderTextColor='rgba(0, 0, 0, 0.35)' />

          <View style={styles.loopBox}>
            <Switch onValueChange={loop => this.setState({loop})} value={this.state.loop} />
            <Text>Loop?</Text>
          </View>

          <TouchableHighlight onPress={() => this.newAction()}>
            <Text style={[styles.button, {flex: null}]}>+ New Action</Text>
          </TouchableHighlight>

          <ScrollView style={{marginVertical: 4}}>
            {
              this.state.actions.map((action, index) => {
                return <ActionBit key={index} action={action} lights={this.props.lights} save={this.saveAction.bind(this)} />
              })
            }
          </ScrollView>

          <View style={styles.buttons}>
            <TouchableHighlight onPress={() => this.props.save(this.state)}>
              <Text style={[styles.button, {marginRight: 16}]}>Add</Text>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.props.close()}>
              <Text style={styles.button}>Close</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
    )
  }

  newAction() {
    let actions = this.state.actions

    actions.push({
      id: this.guid(),
      light: null,
      colour: null,
      delay: null
    })

    this.setState({actions})
  }

  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4()
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  saveAction(action) {
    let actions = this.state.actions

    actions.forEach(a => {
      if(a.id===action.id) {
        a.light = action.light
        a.colour = action.colour
        a.delay = action.delay
        a.tileColour = action.tileColour
      }
    })

    this.setState({actions})
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 16
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    flex: 1,
    padding: 8,
    textAlign: 'center',
    fontSize: 16
  },
  loopBox: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})