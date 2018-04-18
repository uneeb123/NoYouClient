import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  AsyncStorage,
  View
} from 'react-native';
import FormData from 'form-data';

type Props = {};
export default class HomePage extends Component<Props> {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._loadUser();
  }

  async _loadUser() {
    var username = await AsyncStorage.getItem('username');
    const { navigate } = this.props.navigation;
    if (username != null) {
      get_url = "http://api.addr.company:3000/user/" + username;
      fetch(get_url).then((response) => {
        response.json().then(json => {
          if (json.error) {
            console.log(json);
          }
          else {
            if (json.balance > 0) {
              navigate('User', {
                username: json.username,
                balance: json.balance
              });
            } else {
              navigate('Find', {
                username: json.username,
              });
            }
          }
        });
      });
    } else {
      // navigate to create page
      navigate('Create');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>
          Hello!
        </Text>
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
