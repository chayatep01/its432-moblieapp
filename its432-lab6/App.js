import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, Dimensions, TouchableHighlight, Button } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

import MapView from 'react-native-maps';
var {width, height} = Dimensions.get('window');

export default class App extends Component {
  marker
  constructor(props) {
    super(props);  
    this.state = {
      location: null,
      errorMessage: null,
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      pin: false,
      pinCoords: {
        latitude: null,
        longitude: null
      },
      calloutVisible: false
    };
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.handleDropPin = this.handleDropPin.bind(this);
  }

  onRegionChangeComplete(region) {
    this.setState({region});
  }

  handleDropPin(){
    console.log("pin drop");
    this.setState({
      pin: true,
      pinCoords: {
        latitude: this.state.region.latitude,
        longitude: this.state.region.longitude
      }
    });
    if (this.marker && this.state.calloutVisible) this.marker.showCallout()
  }

  UNSAFE_componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    // console.log(location);
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
    // console.log(region);
    this.setState({
      region:region,
      location: location
    });
  };

  getJSXshow(error) {
    if(error)
      return <Text style={styles.paragraph}>{this.state.errorMessage}</Text>
    else{
      return (
        <MapView style={styles.map}
          region={this.state.region}
          onRegionChangeComplete={this.onRegionChangeComplete}
        >
          {this.state.pin ? 
            <MapView.Marker
              key={'key'}
              coordinate={{latitude: this.state.pinCoords.latitude, longitude: this.state.pinCoords.longitude}}
              title={'my location'}
              ref={markerRef => this.marker = markerRef}
              description={String(this.state.region.latitude) + ", "  + String(this.state.region.longitude)}
            >
              {this.state.pinCoords.latitude && this.state.pinCoords.longitude && <MapView.Callout>
                <TouchableHighlight onPress={() => this.setState({ calloutVisible: true })}>
                  <Text>Lat: {this.state.pinCoords.latitude.toFixed(3)}, Long: {this.state.pinCoords.longitude.toFixed(3)}</Text>
                </TouchableHighlight>
              </MapView.Callout>}
            </MapView.Marker>
            : null
          }
        </MapView>
      );
    }
  }

  render() {
    // let text = 'Waiting..';
    let error;
    if (this.state.errorMessage) {
      error = true;
    } else if (this.state.location) {
      error = false;
    }

    return (
      <React.Fragment>
      <View style={styles.container}>
        {this.getJSXshow(error)}
      </View>
      <View>
        <Button
          title="Place a pin!"
          onPress={this.handleDropPin}
          color="#f194ff"
        />
      </View>
      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#ecf0f1',
    marginBottom:50
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  map: {
    width: width,
    height: height,
  }
});