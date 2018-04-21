import HomePage from './HomePage';
import CreatePage from './CreatePage';
import UserPage from './UserPage';
import FindPage from './FindPage';
import React, { Component } from 'react';
import { MessageBar, showMessage } from 'react-native-messages';
import { View } from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

const StackNav = StackNavigator(
  {
    Home: { screen: HomePage },
    Create: { screen: CreatePage },
    User: { screen: UserPage },
    Find: { screen: FindPage },
  },
  {
    initialRouteName: 'Home',
  }
);

export default class App extends Component<{}> {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <StackNav/>
        <MessageBar/>
      </View>
    );
  }
}
