import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert } from 'react-native';
import StartStopButton from './src/components/StartStopButton';
import ShowTime from './src/components/ShowTime';
import LapButton from './src/components/LapButton'

var interval;
var startTime

export default function App() {
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);

  function handleStartPress() {
    if (running) {
      clearInterval(interval);
      setRunning(false);
      return;
    }
    startTime = new Date()
    interval = setInterval(() => {
      setTimeElapsed(new Date() - startTime);
      setRunning(true);
    }, 30);
  }

  return (
    <View style={styles.container}> 
      <View style={styles.header}>
        <View style={styles.timerWrapper}>
          <ShowTime timeElapsed={timeElapsed} />
        </View>
        <View style={styles.buttonWrapper}>
          <StartStopButton running={running} handleStartPress={() =>{handleStartPress()}} />
          <LapButton handleLapPress={()=>{Alert.alert('lap')}} />
        </View>
      </View>
      <View style={styles.footer}>
        <Text>Laps go here</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Fill the entire the screen
    margin: 20
  },
  header: {
    flex: 1
  },
  footer: {
    flex: 1
  },
  timerWrapper: {
    flex: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonWrapper: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
});
