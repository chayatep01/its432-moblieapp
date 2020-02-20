import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button
} from 'react-native';

import MapView from 'react-native-maps';

var {width, height} = Dimensions.get('window');


export default class App extends Component {
  markerRef = new Array(3)
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 13.764884,
        longitude: 100.538265,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      markers:[
          {
            latlng: {latitude: 13.764884, longitude: 100.538265},
            title: "Victory Monument",
            description: "A large military monument in Bangkok, Thailand."
          },
          {
            latlng: {latitude: 13.763681, longitude: 100.538125},
            title: "Saxophone Club",
            description: "A music pub for saxophone lover"
          },
          {
            latlng: {latitude: 13.764595, longitude: 100.537438},
            title: "Coco Department Store",
            description: "A fashion department store"
          }
      ],
      currentKey: -1
    };
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.moveMaptoLocation = this.moveMaptoLocation.bind(this);
  }

  onRegionChangeComplete(region) {
    this.setState({region});
    if(this.state.currentKey !== -1){
      setTimeout(() => this.markerRef[this.state.currentKey].showCallout() , 1500)
    } 
  }

  moveMaptoLocation(region) {
    console.log(region);
    this.refs.map.animateToRegion(region, 3000);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
          ref="map"
        >
        {this.state.markers.map((marker,i) => {
          return(
            <MapView.Marker
              key={i}
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
              ref={_marker => this.markerRef[i] = _marker}
            />
          );
        })}
        </MapView>
        <View style={styles.container}>
          <View style={{padding: 5}}>
            <Button
              title="Victory Monument"
              onPress={() => this.moveMaptoLocation({latitude: 13.764884, longitude: 100.538265, latitudeDelta: 0.002, longitudeDelta: 0.002})
              || this.setState({currentKey: 0})}
            />
          </View>
          <View style={{padding: 5}}>
            <Button
              title="Saxophone Club"
              onPress={() => this.moveMaptoLocation({latitude: 13.763681, longitude: 100.538125, latitudeDelta: 0.002, longitudeDelta: 0.002})
              || this.setState({currentKey: 1})}
            />
          </View>
          <View style={{padding: 5}}>
            <Button
              title="Coco Department Store"
              onPress={() => this.moveMaptoLocation({latitude: 13.764595, longitude: 100.537438, latitudeDelta: 0.002, longitudeDelta: 0.002})
              || this.setState({currentKey: 2})}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    width: width,
    height: Math.floor(height*2/3)
  }
});