import React from 'react';
import { ScrollView } from 'react-native';
import Lap from './Lap'

function LapContainer(props) {
  return (
    <ScrollView style={{flex: 1}}>
      {
        props.laps.map(function(lap, i) {
          return (
            <Lap index={i} lap={lap} />
          )
        })
      }
    </ScrollView>
  )
}

export default LapContainer;