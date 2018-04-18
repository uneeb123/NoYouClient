import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  View
} from 'react-native';

type Props = {};
export default class FindPage extends Component<Props> {
  constructor(props) {
    super(props);
  }

  // TODO: implement polling
  render() {
    return (
      <View style={styles.container}>
      <Text>
        Find a benefactor to get you started
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
