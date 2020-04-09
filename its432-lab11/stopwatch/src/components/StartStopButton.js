import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

function StartStopButton(props) {
  var style = props.running ? styles.stopButton : styles.startButton;
  return (
    <TouchableHighlight underlayColor="gray"
      onPress={props.handleStartPress} style={[styles.button, style]}>
      <Text>
        {props.running ? 'Stop' : 'Start'}
      </Text>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 2,
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  startButton: {
    borderColor: 'green'
  },
  stopButton: {
    borderColor: 'red'
  }
});

export default StartStopButton;