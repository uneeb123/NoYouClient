import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View
} from 'react-native';
import FormData from 'form-data';

type Props = {};
export default class UserPage extends Component<Props> {
  static navigationOptions = {
    header: null,
  }

  state = {
    username: 'undefined',
    balance: 0,
    sender: ''
  }

  _sendAmount = () => {
    sender = this.state.sender.toLowerCase();
    username = this.state.username;
    const { navigate } = this.props.navigation;
    // TODO: replace with error message
    if (username == 'undefined') return;
    send_url = "http://api.addr.company:3000/send/" + sender;
    const form = new FormData();
    form.append('from_user', username);
    fetch(send_url, { method: 'POST', body: form }).then((response) => {
      response.json().then(json => {
        if (json.error) {
          // TODO: catch error
        }
        navigate('Home');
      });
    });
  }

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    if (params) {
      this.state.username = params.username;
      this.state.balance = params.balance;
    }
  }

  render() {
    let balance = this.state.balance;

    return (
      <View style={styles.container}>
        <Text>{balance}</Text>
        <TextInput
          onChangeText={(text) => this.setState({sender: text})}
          value={this.state.sender}
        />
        <Button
          onPress={this._sendAmount}
          title="Send"
        />
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
});
