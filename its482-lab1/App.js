import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [stateA, setStateA] = useState('Hello')
  useEffect(() => {
    setStateA('Byeeeee')
  }, [setStateA])//componentdidmount()
  return (
   
    <View style={styles.container}>
      <Text>Trongtrong will get A+</Text>
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
