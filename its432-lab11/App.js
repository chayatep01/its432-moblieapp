import React, { useState, useEffect } from 'react';

import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import {
  LineChart,
} from 'react-native-chart-kit'

import StockButton from './StockButton.js';

import Switch from './Switch.js';

import API from './api.js';

export default function App() {

  const [dates, set_dates] = useState(["01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01", ])
  const [prices, set_prices] = useState([1,2,3,4,5,6,7])
  const [periodText, set_periodText] = useState('Weekly Time Series')
  const [currentIndex, set_currentIndex] = useState('GOOGL')

  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // color of background
    strokeWidth: 2 // optional, default 3
  }

  useEffect(() => {
    switch (currentIndex) {
      case 'AAPL' : 
        changeIndex('AAPL', 'Apple') 
        return
      case 'GOOGL':
        changeIndex('GOOGL', 'Google')
        return
      case 'UBER' :
        changeIndex('UBER', 'Uber')
        return
    }
  }, [periodText])

  const changeIndex = (stockCode, stockName) => {
    //console.log(stockCode, stockName);
    API(stockCode, periodText).then((stock) => {
      let datesArray = Object.keys(stock[periodText]).slice(0,6)
      let closingPrice = [];
      datesArray.forEach((day) => {
        closingPrice.push(stock[periodText][day]["4. close"]);
      })
      let datesArrayRev = datesArray.reverse()
      const datesArrayRevFixed = datesArrayRev.map(d => d.slice(5, d.length))
      console.log(datesArray);
      console.log(closingPrice);
      console.log(datesArrayRev);
      set_dates(datesArrayRevFixed),
      set_prices(closingPrice)
      set_currentIndex(stockCode)
    })
  }

  const onValueChangeSwitch = () => {
    if (periodText === 'Weekly Time Series') {
      set_periodText('Time Series (Daily)')
    } else {
      set_periodText('Weekly Time Series')
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <Text>{periodText}</Text>
      <Text style={{padding: 2}}>{currentIndex}</Text>
      <LineChart
        data={{
          labels: dates,
          datasets: [{
            data: prices,
            color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // colar of the line
            strokeWidth: 2 // optional
          }]
        }}
        width={Dimensions.get('window').width}
        height={220}
        chartConfig={chartConfig}
        style={{paddingVertical:10}}
      />
      </View>
      <View style={styles.footer}>
        <StockButton code='AAPL' name='Apple' onPress={() => changeIndex('AAPL', 'Apple')}/>
        <StockButton code='GOOGL' name='Google' onPress={() => changeIndex('GOOGL', 'Google')}/>
        <StockButton code='UBER' name='Uber' onPress={() => changeIndex('UBER', 'Uber')}/>
      </View>
      <View style={{height: 50}}>
        <Switch onValueChange={onValueChangeSwitch}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    flex:2,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'yellow'
  },
  footer:{
    flex:1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'pink'
  },
  button: {
    margin: 10,
    borderWidth: 1,
    width: 100,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightgray'
  }
});
  