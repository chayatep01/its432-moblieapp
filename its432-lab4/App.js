import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

import Stocks from './components/Stocks05'
import Switch from './components/Switch'




export default function App() {
  return (
    <View style={styles.container}>
      <View>
        <Stocks />
      </View>
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
