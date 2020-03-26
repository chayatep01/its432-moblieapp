import React from 'react';
import { Platform, StyleSheet, Text, View, 
  TouchableHighlight, TextInput, Image, Alert,
  ScrollView, Dimensions, ActivityIndicator, Button } from 'react-native';

// https://github.com/zeit/next.js/issues/1999 (then ctrl+f for Purii)
import firebase from './firebase_config';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

// https://www.npmjs.com/package/react-native-open-maps
import openMap from 'react-native-open-maps';

import MapView from 'react-native-maps';
var {width, height} = Dimensions.get('window');

// navigation stuffs
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const RADIUS = 20;

function Restaurant(props) {
  return (
    <TouchableHighlight onPress={()=>{
      props.navigation.navigate('Details',{
        res_data: props.res_data
      });
    }} underlayColor="white">
      <View style={styles.restaurant}>
        <Text style={{fontSize: 20}}>{props.res_data.name}</Text>
        <Text style={{fontSize: 12}}>วันทำการ {props.res_data.open_day}    เวลาทำการ {props.res_data.open_time}</Text>
        <Text style={{fontSize: 12}}>โทรศัพท์ {props.res_data.phone}</Text>
        <View style={{flexDirection: 'row'}}>
          <Image source={{uri: props.res_data.images[0]}} style={styles.food_img}/>
          <Image source={{uri: props.res_data.images[1]}} style={styles.food_img}/>
          <Image source={{uri: props.res_data.images[2]}} style={styles.food_img}/>
        </View>
      </View>
    </TouchableHighlight>
  );
}

class HomeScreen extends React.Component {

  constructor(props) {
    super(props);
    this.database = firebase.database();
    this.restaurantRef = this.database.ref('restaurant');
    this.state = {
      searchText: '',
      isShowNearby: true,
      restaurantData: null,
      location: null,
      errorMessage: null,
      searchResult: [],
      region: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    };
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);

    this._readDB();
  }

  _onPressButton() {
    if(this.state.restaurantData) {
      // data is loaded from firebase
      const restaurantData = this.state.restaurantData;
      var restaurantFound = []; // restaurant found put here

      // regex stuffs
      // https://www.w3schools.com/jsref/jsref_obj_regexp.asp
      // https://makandracards.com/makandra/15879-javascript-how-to-generate-a-regular-expression-from-a-string
      patt = new RegExp(this.state.searchText, 'i'); // buid regex pattern
      // search for restaurant
      for (let i = 0; i < restaurantData.length; i++){
        res_name = restaurantData[i].name;
        var result = res_name.match(patt);
        if (result) {
          // if result is not null, a match is found
          restaurantFound.push(restaurantData[i])
        }
      }
      // search by food type
      for (let i = 0; i < restaurantData.length; i++){
        food_type = restaurantData[i].type;
        var result = food_type.match(patt);
        if (result) {
          // if result is not null, a match is found
          restaurantFound.push(restaurantData[i])
        }
      }
      this.setState({
        isShowNearby:false,
        searchResult: restaurantFound
      });
    }
  }

  onRegionChangeComplete(region) {
    this.setState({region});
  }

  componentWillMount() {
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
    console.log(region);
    this.setState({
      region:region,
      location: location
    });
  };

  _readDB() {
    this.restaurantRef.once('value', (snapshot)=>{
      // console.log(snapshot.val());
      this.setState({restaurantData: snapshot.val()})
      console.log(this.state.restaurantData[0].name);

    });
  }

  _computeDistance(lat1,lon1,lat2,lon2) {
    lat1 = parseFloat(lat1);
    lon1 = parseFloat(lon1);
    lat2 = parseFloat(lat2);
    lon2 = parseFloat(lon2);

    var toRadians = (deg) => {
      return deg * Math.PI/180;
    }
    // https://www.movable-type.co.uk/scripts/latlong.html
    var R = 6371e3; // metres
    var phi1 = toRadians(lat1);
    var phi2 = toRadians(lat2);
    var delta_phi = toRadians((lat2-lat1));
    var delta_lambda = toRadians((lon2-lon1));
  
    var a = Math.sin(delta_phi/2) * Math.sin(delta_phi/2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(delta_lambda/2) * Math.sin(delta_lambda/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
    var d = R * c;
  
    return d; // in metres
  }


  _isWithinRadius(latlong) {
    /*
    latlong is string of latlong, e.g. "13.6565217,100.6212236"
    this function computes the distance from current location
    (this.state.location.coords.latitude, this.state.location.coords.longitude)
    to latlong and determine if it's within RADIUS km 
    */

    var distance, lat, long;
    
    if (typeof(latlong) !== "string")
      throw "latlong must be a string"
    data = latlong.split(',')
    lat = parseFloat(data[0])
    long = parseFloat(data[1])

    // compute the distance from current location to latlong
    if (this.state.location) {
      currentLat = this.state.location.coords.latitude;
      currentLong = this.state.location.coords.longitude;
      distance = this._computeDistance(lat,long,currentLat,currentLong)
    }
    else {
      throw "location is not available yet"
    }

    if (distance <= RADIUS*1000)
      return true;
    else
      return false;
  }

  showNearby() {
    if (this.state.restaurantData){
      const restaurantData = this.state.restaurantData;
      var nearbyRestaurantData = [];
      for (let i = 0; i < restaurantData.length; i++){
        if(this._isWithinRadius(restaurantData[i].gps)) {
          nearbyRestaurantData.push(restaurantData[i])
        }
      }
      return (
        <View style={styles.restaurantContainer}>
          <ScrollView style={{flex:1}}>
            {nearbyRestaurantData.map((res_data,i) => {
              return (
                <Restaurant
                  key={i}
                  res_data={res_data}
                  navigation={this.props.navigation}
                />
              )
            })}
            {/* workaround for scrollview cutoff at the bottom */}
            <Image source={require('./images/bottom_filler.png')}/>
          </ScrollView>
        </View>
      )
    }
    else {
      return (
        <View style={styles.restaurantContainer}>
          <Text>Please Wait</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
  }

  showSearchResult() {
    if (this.state.searchResult[0]){
      return (
        <View style={styles.restaurantContainer}>
          <ScrollView style={{flex:1}}>
            {this.state.searchResult.map((res_data,i) => {
              return (
                <Restaurant
                  key={i}
                  res_data={res_data}
                  navigation={this.props.navigation}
                />
              )
            })}
            {/* workaround for scrollview cutoff at the bottom */}
            <Image source={require('./images/bottom_filler.png')}/>
          </ScrollView>
        </View>
      )
    }
    else {
      return (
        <Text>No restaurant found</Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Restaurant Search
        </Text>
        <View style={styles.searchArea}>
          <TextInput
            style={{height: 20, width:300, fontSize: 20}}
            placeholder="Search"
            onChangeText={(text) => this.setState({searchText: text})}
          />
          <TouchableHighlight onPress={()=>this._onPressButton()} underlayColor="white">
            <View style={styles.searchButton}>
              <Image
                style={{height:30, width:30}}
                source={require('./images/search_icon.png')}
              />
            </View>
          </TouchableHighlight>
        </View>
        <View>
          {this.state.isShowNearby ? this.showNearby() : this.showSearchResult()}
        </View>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    /* 2. Read the params from the navigation state */
    const { res_data } = this.props.route.params;
    const reviews = res_data.reviews;
    let sum_stars = 0;
    for (let i = 0; i < reviews.length; i++){
      sum_stars += parseInt(reviews[i].stars);
    }
    let average_star = sum_stars/reviews.length;
    console.log(average_star);
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Restaurant
          key={1}
          res_data={res_data}
          navigation={this.props.navigation}
        />
        {/* show star picture and average star value */}
        {/* show review texts */}
      </View>
    );
  }
}

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Restaurants',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20
  },
  title: {
    fontSize: 20,
    padding: 10
  },
  searchArea: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: '#E5E4E3',
    borderRadius: 10,
    alignItems: 'center'
  },
  restaurantContainer: {
    padding: 5,
    margin: 10,
    backgroundColor: '#E5E4E3',
    width: 350,
    flex:1
  },
  restaurant: {
    padding: 5,
    margin: 5,
    backgroundColor: '#FFFFFF',
  },
  food_img: {
    width: 100,
    height: 100,
    margin: 3
  }
});
