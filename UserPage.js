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
import Container from './Container';

type Props = {};
export default class UserPage extends Component<Props> {
  static navigationOptions = {
    header: null,
  }

  state = {
    balance: 0,
    sender: '',
    score: 0,
    buttonDisabled: false,
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
    balance = Number(balance);
    var checkpoints = Object.keys(this.scoreMap).sort(function(a,b) {
      return (+a) - (+b);
    }).reverse();
    if (balance >= checkpoints[0]) {
      this.setState({score: 1});
    }
    else if (balance <= checkpoints[checkpoints.length - 1]) {
      this.setState({score: this.scoreMap[checkpoints[checkpoints.length-1]]});
    }
    else {
      for (var i = 1; i < checkpoints.length; i++) {
        var upperBound = Number(checkpoints[i-1]);
        var lowerBound = Number(checkpoints[i]);
        if ((balance >= lowerBound) && (balance < upperBound)) {
          this.setState({score: this.scoreMap[checkpoints[i]]});
        }
      }
    }
  }

  _saveReceiver(recv) {
    AsyncStorage.getItem('receivers', (err, all_receivers) => {
      if (err) {
        console.log(err);
      }
      if (all_receivers) {
        var receiversArray = all_receivers.split(',');
        receiversArray.push(recv);
        all_receivers = receiversArray.join(',');
        AsyncStorage.setItem('receivers', all_receivers);
      }
      else {
        AsyncStorage.setItem('receivers', recv);
      }
    });
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

  _fetchUserName() {
    AsyncStorage.getItem('username', (err, result) => {
      this.setState({
        username: result,
      });
    });
  }

  _sendMoney = async () => {
    Keyboard.dismiss();
    sender = this.state.sender;
    var me = this.state.username;
    this.setState({buttonDisabled: true});
    try {
      var all_receivers = await AsyncStorage.getItem('receivers');
      if (all_receivers !== null){
        if (this._checkIfAlreadySent(all_receivers, sender)) {
          showMessage("Already sent money to this guy once!");
          this.setState({buttonDisabled: false});
          return;
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
          this.setState({buttonDisabled: false});
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
                this.setState({buttonDisabled: false});
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
    const { params } = this.props.navigation.state;
    if (params) {
      this.state.balance = params.balance;
    }
    this._fetchUserName();
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

  componentWillMount() {
    this._getScore(this.state.balance);
  }

  _scoreBars(score) {
    x = [];
    for (var i = 0; i < score; i++) {
      x.push(<View key={i} style={styles.scoreBar}/>)
    }
    return x;
  }

  render() {
    let balance = this._formatNumber(this.state.balance);
    let name = "donate";
    let score = this.state.score;
    let imageSource = this._imageForSource(score);
    let image = <Image source={imageSource} style={styles.image}/>; 
    let username = this.state.username;
    let buttonDisabled = this.state.buttonDisabled;
    let bar = this._scoreBars(score);

    const enabledButton = <TouchableOpacity
            style={styles.buttonEnabled} onPress={this._sendMoney}>
            <Text>send</Text>
          </TouchableOpacity>
    const disabledButton = <TouchableOpacity
            style={styles.buttonDisabled} disabled={true}>
            <Text>sending...</Text>
          </TouchableOpacity>


    return (
      <Container>
        <View style={styles.container}>
          <View style={styles.userContainer}>
            <Text>
              <Text style={styles.playerLabel}>player name: </Text>
              <Text style={styles.playerName}>{username}</Text>
            </Text>
          </View>
          <View style={styles.balanceContainer}>
            <Text style={{color: 'white'}}>your balance</Text>
            <Text style={styles.balance}>{balance}</Text>
          </View>
          <View style={styles.imageContainer}>
            <Text>{score}</Text>
            <View style={styles.scoreMeter}>
              {bar}
            </View>
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
            {buttonDisabled ? disabledButton : enabledButton}
          </View>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  balanceContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  balance: {
    fontSize: 60,
    color: 'white',
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
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1
  },
  buttonEnabled: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  buttonDisabled: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  nameLabel: {
    textAlign: 'right',
    margin: 20,
    flex: 1,
    color: 'white',
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
  },
  userContainer: {
    backgroundColor: 'rgba(250, 250, 250, 0.3)',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    alignSelf:'baseline'
  },
  playerLabel: {
    fontSize: 10,
    color: 'white',
  },
  playerName: {
    fontSize: 13,
    color: 'white',
  },
  scoreMeter: {
    width: 200,
    height: 50,
    backgroundColor: 'rgba(250, 250, 250, 0.8)',
    flexDirection: 'row',
    overflow: 'hidden',
    borderRadius: 20,
  },
  scoreBar: {
    width: 15,
    height: 55,
    backgroundColor: '#68f441',
    margin: 1,
  }
});
