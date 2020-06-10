/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Dimensions, Text, ScrollView} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    header: <HeaderComponent backVisible={true} />,
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Text
          style={{
            fontSize: 24,
            textDecorationLine: 'underline',
            fontFamily: 'Courier New',
            fontWeight: 'bold',
          }}>
          Settings
        </Text>
        <ScrollView />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    textAlign: 'center',
    alignItems: 'center',
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#617E8C',
  },
});

export default SettingsScreen;
