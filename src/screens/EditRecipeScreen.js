import React from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import {withNavigation} from 'react-navigation';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class EditRecipeScreen extends React.Component {
  static navigationOptions = {
    header: <HeaderComponent backVisible={true} returnPage={'ManageBarbot'} />,
  };

  componentDidMount() {}

  state = {};

  render() {
    return (
      <View style={styles.mainView}>
        <Text>Testing</Text>
      </View>
    );
  }
}

export default withNavigation(EditRecipeScreen);

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#617E8C',
  },

  headerText: {
    fontSize: 22,
    textDecorationLine: 'underline',
    paddingBottom: 10,
  },

  buttonStyle: {
    backgroundColor: '#3E525C',
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  lightButtonStyle: {
    borderRadius: 20,
    width: 175,
    backgroundColor: '#7295A6',
    alignSelf: 'center',
  },

  textStyle: {
    fontSize: 20,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  ingredientText: {
    fontSize: 16,
    textAlign: 'center',
  },

  subtext: {
    fontSize: 18,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  textInput: {
    height: 40,
    width: screenWidth / 2.5,
    borderColor: 'gray',
    borderWidth: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 7,
  },

  overlay: {
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },

  backButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },

  scrollContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    maxHeight: 50,
  },

  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 90,
    alignContent: 'center',
  },

  iconText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
