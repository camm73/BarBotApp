import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import {Overlay} from 'react-native-elements';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

//Required props (visible, message) optional props (title)
class LoadingComponent extends React.Component {
  state = {};

  render() {
    return (
      <Overlay
        width={screenWidth / 1.3}
        height={140}
        isVisible={this.props.visible}
        overlayStyle={styles.overlay}>
        <>
          <Text style={styles.titleStyle}>
            {this.props.title !== undefined ? this.props.title : 'Loading'}
          </Text>
          <ActivityIndicator size="large" color="black" />
          <Text style={styles.textStyle}>{this.props.message}</Text>
        </>
      </Overlay>
    );
  }
}

export default LoadingComponent;

const styles = StyleSheet.create({
  overlay: {
    borderRadius: 20,
    backgroundColor: 'lightgray',
    justifyContent: 'space-around',
  },
  titleStyle: {
    fontSize: 20,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  textStyle: {
    fontSize: 18,
    textAlign: 'center',
  },
});
