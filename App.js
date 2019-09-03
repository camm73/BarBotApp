import React from 'react';
import {createAppContainer, createStackNavigator, SafeAreaView} from 'react-navigation';
import HomeScreen from './src/screens/HomeScreen';
import BarbotScreen from './src/screens/BarbotScreen';

const App = () => {
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
  }
}, {
    initialRouteName: 'Home',
});

const AppContainer = createAppContainer(AppNavigator);

export default App;
