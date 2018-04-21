import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  Button,
  TouchableOpacity,
  AsyncStorage,
  Image,
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
    sender: '',
    score: 1,
  }

  scoreMap = {
    "1000000": 1,
    "500000": 2,
    "100000": 3,
    "50000": 4,
    "10000": 5,
    "5000": 6,
    "1000": 7,
    "500": 8,
    "100": 9,
    "50": 10,
    "10": 11,
    "5": 12,
    "1": 13,
  }

  _getScore(balance) {
    var checkpoints = Object.keys(this.scoreMap);
    var score;
    checkpoints.reverse().forEach((point) => {
      if (balance <= point) {
        if (!score) {
          score = this.scoreMap[point];
        }
      }
    });
    return score;
  }

  async _saveReceiver(recv) {
    try {
      var all_receivers = await AsyncStorage.getItem('receivers');
      var receiversArray = all_receivers.split(',');
      receiversArray.push(recv);
      all_receivers = receiversArray.join(',');
      AsyncStorage.setItem('receivers', all_receivers);
    } catch(error) {
      AsyncStorage.setItem('receivers', recv);
    }
  }

  _checkIfAlreadySent(receivers, actual) {
    var there = false;
    receiversArray = receivers.split(',');
    receiversArray.forEach((receiver) => {
      if (receiver == actual) {
        there = true;
      }
    });
    return there;
  }

  _sendMoney = async () => {
    sender = this.state.sender;
    var me = await AsyncStorage.getItem('username');
    try {
      var all_receivers = await AsyncStorage.getItem('receivers');
      if (all_receivers !== null){
        if (this._checkIfAlreadySent(all_receivers, sender)) {
          showMessage("Already sent money to this guy once!");
          return;
        }
        else {
          await AsyncStorage.setItem('receivers', '');
        }
      }
    } catch (error) {
      // swallow
      await AsyncStorage.setItem('receivers', '');
    }
    const { navigate } = this.props.navigation;
    get_url = "http://api.addr.company:3000/user/" + sender;
    fetch(get_url).then((response) => {
      response.json().then(json => {
        if (json.error) {
          showMessage("Can't find user!");
        }
        else {
          // send money
          send_url = "http://api.addr.company:3000/send/" + sender;
          var body = { from_user: me };
          fetch(send_url, { 
            method: 'POST',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'application/json'}
          }).then((response) => {
            response.json().then(json => {
              if (json.error) {
                showMessage("Something went wrong");
              }
              else {
                this._saveReceiver(sender);
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
      this.state.score = this._getScore(params.balance);
    }
  }
  
  _imageForSource(score) {
    sourceToImage = {
      13: require('./Resources/1.png'),
      12: require('./Resources/2.png'),
      11: require('./Resources/3.png'),
      10: require('./Resources/4.png'),
      9: require('./Resources/5.png'),
      8: require('./Resources/6.png'),
      7: require('./Resources/7.png'),
      6: require('./Resources/8.png'),
      5: require('./Resources/9.png'),
      4: require('./Resources/10.png'),
      3: require('./Resources/11.png'),
      2: require('./Resources/12.png'),
      1: require('./Resources/13.png'),
    }

    return sourceToImage[score];
  }

  render() {
    let balance = this._formatNumber(this.state.balance);
    let name = "donate";
    let score = this.state.score;
    let imageSource = this._imageForSource(score);
    let image = <Image source={imageSource} style={styles.image}/>; 
    let username = this.state.username;

    return (
      <View style={styles.container}>
        <MessageBar/>
        <View style={styles.balanceContainer}>
          <Text>{username}</Text>
          <Text>{username} your balance</Text>
          <Text style={styles.balance}>{balance}</Text>
        </View>
        <View style={styles.imageContainer}>
          {image}
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
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    height: 200,
    width: 200,
    resizeMode: 'contain'
  }
});
