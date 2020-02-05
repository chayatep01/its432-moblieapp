import React, { Component } from 'react';

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

import API from './api.js';

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`, // color of background
  strokeWidth: 2 // optional, default 3
}

export default class Stocks extends Component {

  constructor(props){
    super(props);
    this.changeIndex = this.changeIndex.bind(this);
    this.state = {
      dates: ["01/01", "02/01", "03/01", "04/01", "05/01", "06/01", "07/01", ],
      prices: [1,2,3,4,5,6,7]
    }

    this.data = {
      labels: this.state.dates,
      datasets: [{
        data: this.state.prices,
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // colar of the line
        strokeWidth: 2 // optional
      }]
    }
  }

  changeIndex(stockCode, stockName){
    console.log(stockCode, stockName);
    API(stockCode).then((stock) => {
      let datesArray = Object.keys(stock["Time Series (Daily)"]).slice(0,6)
      let closingPrice = [];
      datesArray.forEach((day) => {
        closingPrice.push(stock["Time Series (Daily)"][day]["4. close"]);
      })
      let datesArrayRev = datesArray.reverse()
      this.setState({
        dates: datesArrayRev,
        prices: closingPrice
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
        <LineChart
          data={this.data}
          width={Dimensions.get('window').width}
          height={220}
          chartConfig={chartConfig}
          style={{paddingVertical:10}}
        />
        </View>
        <View style={styles.footer}>
          <StockButton code='AAPL' name='Apple' onPress={this.changeIndex}/>
          <StockButton code='GOOGL' name='Google' onPress={this.changeIndex}/>
          <StockButton code='UBER' name='Uber' onPress={this.changeIndex}/>
        </View>
      </View>
    );
  }
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
  