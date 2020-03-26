import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Picker
} from 'react-native';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      star : "1",
      comment: "",
    }
  }

  render() {
    return (
      <View>

        <View style={{height:20}}/>
        <Text>Stars</Text>
        <Picker
          selectedValue={this.state.star}
          style={{height: 50, width: 100}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({star: itemValue})
          }>
          <Picker.Item label="1 star" value="1" />
          <Picker.Item label="2 star" value="2" />
          <Picker.Item label="3 star" value="3" />
          <Picker.Item label="4 star" value="4" />
          <Picker.Item label="5 star" value="5" />
        </Picker>

        <TextInput
          multiline={true}
          numberOfLine={4}
          style={{height:100, borderColor: 'gray', borderWidth: 1}}
          value={this.state.comment}
          onChangeText={(comment) => this.setState({comment})}
        />

      </View>
    );
 }
}

const styles = StyleSheet.create({
});