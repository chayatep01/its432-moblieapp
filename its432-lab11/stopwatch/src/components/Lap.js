import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import formatTime from 'minutes-seconds-milliseconds';

function Lap(props) {
  return (
    <View style={styles.lap}>
      <Text style={styles.lapText}>
        Lap #{props.index + 1}
      </Text>
      <Text style={styles.lapText}>
        {formatTime(props.lap)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  lap: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    backgroundColor: 'lightgray',
    padding: 10,
    marginTop: 10
  },
  lapText: {
    fontSize: 30
  },
});

export default Lap;