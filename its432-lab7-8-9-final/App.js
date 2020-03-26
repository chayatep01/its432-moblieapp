import React from 'react';
import { Platform, StyleSheet, Text, View, 
  TouchableHighlight, TextInput, Image, Alert,
  ScrollView, Dimensions, ActivityIndicator, Button, TouchableOpacity, Picker } from 'react-native';

// https://github.com/zeit/next.js/issues/1999 (then ctrl+f for Purii)
import firebase from './firebase_config';

import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

// https://www.npmjs.com/package/react-native-open-maps
//import openMap from 'react-native-open-maps';

//import MapView from 'react-native-maps';
var {width, height} = Dimensions.get('window');

// navigation stuffs
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const RADIUS = 20;

function Restaurant(props) {
  return (
    <TouchableHighlight onPress={()=>{
      props.navigation.navigate('Details',{
        res_data: props.res_data,
        changeState: props.changeState
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

function Stars(props) {
  const stars = parseInt(props.stars);
  if (stars === 1){
    return (
      <View>
        <Image source={require('./images/1-star.png')} style={styles.star_img}/>
      </View>
    )
  }
  else if (stars === 2){
    return (
      <View style={styles.star_container}>
        <Image source={require('./images/2-star.png')} style={styles.star_img}/>
      </View>
    )
  }
  else if (stars === 3){
    return (
      <View style={styles.star_container}>
        <Image source={require('./images/3-star.png')} style={styles.star_img}/>
      </View>
    )
  }
  else if (stars === 4){
    return (
      <View style={styles.star_container}>
        <Image source={require('./images/4-star.png')} style={styles.star_img}/>
      </View>
    )
  }
  else if (stars === 5){
    return (
      <View style={styles.star_container}>
        <Image source={require('./images/5-star.png')} style={styles.star_img}/>
      </View>
    )
  }
}

function StarWithAverage(props) {
  let stars_int = Math.round(props.stars);
  let stars2decimal = props.stars.toFixed(2);
  return (
    <View>
      <Text>Average star: {stars2decimal}</Text>
      <Stars stars={stars_int}/>
    </View>
  )
}

function Reviews(props) {
  const reviews = props.reviews;
  return (
    <View style={{flex:1}}>
      <View style={{flexDirection:"row", justifyContent:"center"}}><Text style={{fontSize:16}}>Reviews</Text></View>
      <ScrollView>
        {reviews.map((review,i) => {
          return (
            <View key={i}>
              <Text>{review.comment}</Text>
              <Stars stars={review.stars}/>
            </View>
          )
        })}
        {/* workaround for scrollview cutoff at the bottom */}
        <Image source={require('./images/bottom_filler.png')}/>
      </ScrollView>
    </View>
  )
}

class SignupLogin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      showLogin: true,
    };
  }

  toggleShowLogin() {
    this.setState({
      showLogin: true
    })
  }

  toggleShowSignup() {
    this.setState({
      showLogin: false
    })
  }

  doLogin() {
    firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).then( () => {
      console.log("login successful");
      this.props.loginCB();
    })
    .catch(function(error) {
      // Handle Errors here.
      console.log(error.code);
      console.log(error.message);
      alert(error.message);
      // ...
    })
  }

  doSignup() {
    // https://firebase.google.com/docs/auth/web/start

    // check if the two password fields match
    const password = this.state.password;
    const confirmPassword = this.state.confirmPassword;
    if (password === confirmPassword){
      // do signup
      firebase.auth().createUserWithEmailAndPassword(this.state.username, this.state.password).then( () => {
        console.log("created new user successful");
        this.toggleShowLogin(); // show login page
      })
      .catch(function(error) {
        // Handle Errors here.
        console.log(error.code);
        console.log(error.message);
        alert(error.message);
      });
    }
    else {
      alert("Password do not match !!!");
    }
  }

  showSignup() {
    return (
      <View>
        <View style={styles.group}>
          <Text style={styles.title}>Username</Text>
          <TextInput style={styles.input}
            value={this.state.username}
            onChangeText={(username) => this.setState({username})}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Password</Text>
          <TextInput style={styles.input}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
            />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Confirm Password</Text>
          <TextInput style={styles.input}
            secureTextEntry={true}
            value={this.state.confirmPassword}
            onChangeText={(confirmPassword) => this.setState({confirmPassword})}
            />
        </View>
        <View style={styles.center}>
          <View style={styles.group}>
            <TouchableOpacity onPress={() => {this.toggleShowLogin();}}>
              <Text style={styles.signupText}>Login</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button}
              onPress={() => {this.doSignup()}}>
              <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  showLogin() {
    return (
      <View>
        <View style={styles.group}>
          <Text style={styles.title}>Username</Text>
          <TextInput style={styles.input}
            value={this.state.username}
            onChangeText={(username) => this.setState({username})}/>
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Password</Text>
          <TextInput style={styles.input}
            secureTextEntry={true}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
            />
        </View>
        <View style={styles.center}>
          <View style={styles.group}>
            <TouchableOpacity onPress={() => {this.toggleShowSignup();}}>
              <Text style={styles.signupText}>Signup</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button}
              onPress={() => {this.doLogin()}}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.containerLogin}>
        {this.state.showLogin ? this.showLogin() : this.showSignup()}
      </View>
    );
  }
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
      isLoggedIn: false,
      testState: {
        show: false,
        star: null,
        comment: null,
        restaurant: null
      }
    };
    this.onRegionChangeComplete = this.onRegionChangeComplete.bind(this);
    this.loginSuccess = this.loginSuccess.bind(this);
    this._changeTestState = this._changeTestState.bind(this);

    this._readDB();
  }

  _changeTestState(newState) {
    this.setState({
      testState:newState
    }, () => {
      console.log(this.state.testState)
      let restaurantData = this.state.restaurantData
      for (let i = 0; i < restaurantData.length; i++){
        if(restaurantData[i].name === this.state.testState.restaurant){
          console.log(restaurantData[i])
          restaurantData[i].reviews.push({comment: this.state.testState.comment, stars: this.state.testState.star})
          this.setState({
            restaurantData: restaurantData
          })
        };
      }
    })
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
                  changeState={this._changeTestState}
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
                  changeState={this._changeTestState}
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

  showHome() {
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
    )
  }

  showLogin() {
    return (
      <SignupLogin loginCB={this.loginSuccess}/>
    )
  }

  loginSuccess() {
    this.setState({
      isLoggedIn: true
    })
  }

  render() {
    return (
      <View style={{flex:1}}>
        {this.state.isLoggedIn ? this.showHome() : this.showLogin()}
      </View>
    );
  }
}

class DetailsScreen extends React.Component {

  constructor(props){
    super(props);
    /* 2. Read the params from the navigation state */
    const { res_data } = this.props.route.params;
    const { changeState } = this.props.route.params;
    const reviews = res_data.reviews;
    this.state = {
      showReviews: true,
      star: "1",
      res_data: res_data,
      reviews: reviews,
      changeState:changeState
    };
  }

  writeReview() {
    this.setState({
      showReviews: false
    })
  }

  showWriteReview() { 
    return (
      <View style={{ flex:3 , margin:10, padding:10}}>
       
        <View style={{flex:1,flexDirection: 'row'}}>
          <View>
            <Text Style={{flex:1}}>Stars</Text>
          </View>
          <View>
            <Picker
              selectedValue={this.state.star}
              style={{height: 10, width: 10,flex:1}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({star: itemValue})
              }>
              <Picker.Item label="1 star" value="1" />
              <Picker.Item label="2 star" value="2" />
              <Picker.Item label="3 star" value="3" />
              <Picker.Item label="4 star" value="4" />
              <Picker.Item label="5 star" value="5" />
            </Picker>
          </View>
           
        </View>
        
        <View>
          <TextInput
            multiline={true}
            numberOfLine={4}
            style={{height:100, borderColor: 'gray', borderWidth: 1}}
            value={this.state.comment}
            onChangeText={(comment) => this.setState({comment})}
          />
        </View>
       
        <View style={styles.group}>
          <TouchableOpacity style={styles.button}
            onPress={() => {this._onPressSubmitReview();}}>
            <Text style={styles.buttonText}>Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    ) 
  } 

  _onPressSubmitReview() { 
    // show stars and comments in alert box 
    Alert.alert(this.state.star, this.state.comment);
    this.state.changeState({
      //show: true,
      star: this.state.star,
      comment:  this.state.comment,
      restaurant: this.state.res_data.name
    }) 
    this.setState({ 
      showReviews: true 
    }) 
  } 

  showReviews(res_data, average_star, reviews) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }, styles.restaurantContainer}>
        <Restaurant
          key={1}
          res_data={res_data}
          navigation={this.props.navigation}
          changeState={this.state.changeState}
        />
        {/* show star picture and average star value */}
        <StarWithAverage stars={average_star}/>
        {/* show review texts */}
        <TouchableOpacity onPress={() => {this.writeReview();}}>
          <Text style={styles.signupText}>Write Review</Text>
        </TouchableOpacity>
        <Reviews reviews={reviews}/>
      </View>  
    )
  }

  render() {
    
    let sum_stars = 0;
    for (let i = 0; i < this.state.reviews.length; i++){
      sum_stars += parseInt(this.state.reviews[i].stars);
    }
    let average_star = sum_stars/this.state.reviews.length;
    // console.log(average_star);
    return (
      <View style={{flex:1}}>
        {this.state.showReviews ? this.showReviews(this.state.res_data, average_star, this.state.reviews) : this.showWriteReview()}
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
  },
  star_img : {
    width: 120,
    height:30,
    margin: 3
  },
  star_container : {
    padding: 5,
    margin: 5,
    flexDirection : "row",
    backgroundColor: '#FFFFFF',
    alignItems: "center"
  },
  containerLogin: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 20
  },
  group: {
    marginTop: 20
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderWidth: 1
  },
  buttonText: {
    fontSize: 30
  },
  input: {
    padding: 10,
    height: 40,
    borderWidth: 1
  },
  title: {
    fontSize: 20
  },
  center: {
    alignItems: 'center'
  },
  signupText : {
    fontSize: 20,
    color: 'blue'
  }
});
