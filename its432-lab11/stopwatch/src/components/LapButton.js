import React from 'react';
import { StyleSheet, Text, TouchableHighlight } from 'react-native';

function LapButton(props) {
  return (
    <TouchableHighlight style={styles.button}
    underlayColor="gray" onPress={props.handleLapPress}>
      <Text>
        Lap
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
  }
});

export default LapButton;
