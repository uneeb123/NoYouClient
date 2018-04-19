import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  AsyncStorage,
  Image,
  View,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { MessageBar, showMessage } from 'react-native-messages';

type Props = {};
export default class CreatePage extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = { name: '' };
  }

  _createAccount = () => {
    user = this.state.name.trim();;
    if (!user) {
      showMessage('Please enter name!');
    }
    else if (user != user.toLowerCase()) {
      showMessage('Only single-word, lower-case names accepted!');
    }
    else if (!/^[a-z0-9]+$/.test(user)) {
      showMessage('Names can only be alphanumeric!');
    }
    else {
      var that = this;
      // create user
      create_url = "http://10.0.2.2:3000/create";
      console.log(user);
      var body = { username: user };
      fetch(create_url, { 
        method: 'POST',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json'}}).then((response) => {
        console.log(response);
        response.json().then(json => {
          console.log(json);
          if (json.error) {
            // user already exists
            showMessage('Try a different name!');
          }
          else {
            // navigate to next page
            AsyncStorage.setItem('username', user);
            that._goNext(user);
          }
        });
      });
    }
  }

  _goNext(user) {
    const { navigate } = this.props.navigation;
    get_url = "http://10.0.2.2:3000/user/" + user;
    fetch(get_url).then((response) => {
      response.json().then(json => {
        console.log(json);
        if (json.error) {
          console.log(json);
        }
        else {
          if (json.balance > 0) {
            Keyboard.dismiss
            navigate('User', {
              username: json.username,
              balance: json.balance
            });
          } else {
            navigate('Find');
          }
        }
      });
    });
  }

  render() {
    let title = "no, u!";
    let name = "name";

    return (
      <View style={styles.container}>
        <MessageBar/>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text>
            <Text>{"...because you really, "}</Text>
            <Text style={{fontStyle: 'italic'}}>{"really"}</Text>
            <Text>{" don't need it!"}</Text>
          </Text>
          </View>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('./Resources/title.png')}
          />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameLabel}>{name}</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.setState({name: text})}
            value={this.state.name}
          />
          <TouchableOpacity style={styles.button} onPress={this._createAccount}>
            <Text>enter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  image: {
    width: 155,
    height: 120,
  },
  nameContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  input: {
    flex: 2,
    height: 40,
    width: 180,
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  nameLabel: {
    textAlign: 'right',
    margin: 20,
    flex: 1,
  }
});
