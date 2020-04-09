import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import StartStopButton from './src/components/StartStopButton';
import ShowTime from './src/components/ShowTime';

export default function App() {
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  return (
    <View style={styles.container}>
      <ShowTime timeElapsed={0} />
      <StartStopButton running={running} handleStartPress={()=>{Alert.alert('pressed')}} />
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


