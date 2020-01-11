import React from 'react';
import {createAppContainer, createStackNavigator, SafeAreaView} from 'react-navigation';
import HomeScreen from './src/screens/HomeScreen';
import BarbotScreen from './src/screens/BarbotScreen';
import BottleTutorial from './src/tutorials/BottleTutorial';
import SettingsScreen from './src/screens/SettingsScreen';
import Amplify from 'aws-amplify';
import amplify from '.';
import 'react-native-gesture-handler';

const App = () => {
  console.disableYellowBox = true; //REMOVE AFTER TESTING
  return (
      <AppContainer />
  );
};

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
  
  ManageBarbot: {
    screen: BarbotScreen
  },

  BottleTut: {
    screen: BottleTutorial
  },

  Settings: {
    screen: SettingsScreen
  }
}, {
    initialRouteName: 'Home',
});

const AppContainer = createAppContainer(AppNavigator);

export default App;
