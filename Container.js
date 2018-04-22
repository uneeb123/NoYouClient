import React, { Component } from 'react';
import { View, ImageBackground } from 'react-native';

export default class Container extends Component<{}> {
  render() {
    return (
      <ImageBackground
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
        }}
        source={require('./Resources/background.png')}
      >
        {this.props.children}
      </ImageBackground>
    );
  }
}
