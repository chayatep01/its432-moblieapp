import React from 'react';
import { StyleSheet, Text } from 'react-native';
import formatTime from 'minutes-seconds-milliseconds';

function ShowTime(props) {
  return (
    <Text style={styles.timer}>
      {formatTime(props.timeElapsed)}
    </Text>
  )
}

const styles = StyleSheet.create({
  timer: {
    fontSize: 60
  }
});

export default ShowTime;