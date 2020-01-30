import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Ex1 from './Ex1'
import Stopwatch from './Stopwatch'
export default function App() {
  return (
    <View style={styles.container}>
      <Stopwatch />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
