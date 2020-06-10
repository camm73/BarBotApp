import React from 'react';
import {View} from 'react-native';

class Spacer extends React.Component {
  render() {
    return (
      <View
        height={this.props.height}
        width={this.props.width}
        style={{backgroundColor: this.props.color}}
      />
    );
  }
}

export default Spacer;
