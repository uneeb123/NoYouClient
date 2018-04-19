import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  Button,
  TouchableOpacity,
  AsyncStorage,
  View
} from 'react-native';
import { MessageBar, showMessage } from 'react-native-messages';

type Props = {};
export default class UserPage extends Component<Props> {
  static navigationOptions = {
    header: null,
  }

  state = {
    balance: 0,
    sender: ''
  }

  _sendMoney = async () => {
    sender = this.state.sender;
    var me = await AsyncStorage.getItem('username');
    const { navigate } = this.props.navigation;
    get_url = "http://10.0.2.2:3000/user/" + sender;
    fetch(get_url).then((response) => {
      response.json().then(json => {
        console.log(json);
        if (json.error) {
          showMessage("Can't find user!");
          console.log(json);
        }
        else {
          // send money
          send_url = "http://10.0.2.2:3000/send/" + sender;
          var body = { from_user: me };
          fetch(send_url, { 
            method: 'POST',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'application/json'}
          }).then((response) => {
            console.log(response);
            response.json().then(json => {
              if (json.error) {
                showMessage("Something went wrong");
              }
              else {
                navigate('Home');
              }
            });
          });
        }
      });
    });
  }


  _formatNumber(num) {
    const billion = 100000000;
    const million = 1000000;
    if (num >= billion) {
      let x = num/billion;
      return x.toFixed(2) + " billion";
    }
    else if (num >= million) {
      let x = num/million;
      return x.toFixed(2) + " million";
    }
    else if (num < million) {
      return String(num).replace(/(.)(?=(\d{3})+$)/g,'$1,')
    }
    else {
      return num;
    }
  }

  constructor(props) {
    super(props);
    Keyboard.dismiss
    const { params } = this.props.navigation.state;
    if (params) {
      this.state.username = params.username;
      this.state.balance = params.balance;
    }
  }

  render() {
    let balance = this._formatNumber(this.state.balance);
    let name = "donate";

    return (
      <View style={styles.container}>
        <MessageBar/>
        <View style={styles.balanceContainer}>
          <Text>your balance</Text>
          <Text style={styles.balance}>{balance}</Text>
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.nameLabel}>{name}</Text>
          <TextInput
            style={styles.input}
            autoCorrect={false}
            underlineColorAndroid='transparent'
            onChangeText={(text) => this.setState({sender: text})}
            value={this.state.sender}
          />
          <TouchableOpacity style={styles.button} onPress={this._sendMoney}>
            <Text>send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  balanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    fontSize: 60,
  },
  nameContainer: {
    flexDirection: 'row',
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
