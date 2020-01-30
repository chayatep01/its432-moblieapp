import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Menu from './Menu'

export default function App() {
  return (
    <View style={styles.container}>
        <Menu image={require('./react.png')} title='React Course' text='Some TEXT' />
        <Menu image={require('./react.png')} title='React Native Course' text='my text' />
        <Menu image={require('./react.png')} title='Redux Course' text='hello' />
    </View>
  );
}

const styles = {
  container: {
      flex: 1,
      paddingTop: 50 ,
    },
    
}