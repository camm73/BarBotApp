import React from 'react';
import {StyleSheet, Dimensions, View, Alert, AsyncStorage} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class BottleTutorial extends React.Component {
  static navigationOptions = {
    header: null,
  };

  doneAction = async () => {
    try {
      await AsyncStorage.setItem('bottleInstructionsShow', 'false');
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <View style={{minWidth: screenWidth, minHeight: screenHeight}}>
        <AppIntroSlider
          slides={slides}
          onDone={() => {
            this.doneAction();
          }}
        />
      </View>
    );
  }
}

const slides = [
  {
    key: 'remove',
    title: 'Remove Bottle',
    text:
      'Pressing the "Remove Bottle" button will empty all excess alcohol or mixer from the pump lines back into the bottle.\n\nFor long lines you may need to run this twice.',
    textStyle: {fontSize: 20},
    backgroundColor: '#59b2ab',
  },
  {
    key: 'add',
    title: 'Add Bottle',
    text:
      'Once you have a new bottle connected, holding down this button will pump out the liquid until it is primed.\n\n1. Place a cup below the spout.\n2. Hold the button until the first drops of liquid appear\n3. Release the button.',
    textStyle: {fontSize: 20},
    backgroundColor: '#59b2ab',
  },
];

export default BottleTutorial;
