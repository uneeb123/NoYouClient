import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  AsyncStorage,
  TextInput,
  Button,
  TouchableOpacity,
  View
} from 'react-native';
import Container from './Container';

type Props = {};
export default class FindPage extends Component<Props> {
  static navigationOptions = {
    header: null,
  }
  
  componentDidMount() {
    this._loadUser();
  }

  _loadUser() {
    AsyncStorage.getItem('username', (err, result) => {
      console.log(result);
      this.setState({username: result});
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      username: '',
    }
  }

  _tryAgain = () => {
    const { navigate } = this.props.navigation;
    navigate('Home');
  }

  // TODO: implement polling
  render() {
    let title = "Find a benefactor to get you started";
    var user = this.state.username; 
    let description = `
You currently have nothing in your bank account.

You get you started in the game, you must find a benefactor first. Give them your username "${user}" and ask them to send you some money.

Once you have something in your bank account, you are off the ground!`;

    return (
      <Container>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{description}</Text>
          </View>
          <TouchableOpacity style={styles.button} onPress={this._tryAgain}>
            <Text>found one!</Text>
          </TouchableOpacity>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  descriptionContainer: {
//    justifyContent: 'center',
    flex: 2,
  },
  title: {
    fontSize: 20,
    color: 'white',
  },
  description: {
    margin: 20,
    textAlign: 'center',
    color: 'white',
  },
  button: {
    backgroundColor: '#DDDDDD',
    margin: 50,
    padding: 20,
    elevation: 2,
    borderRadius: 10,
  }
});
