import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import BarbotScreen from './src/screens/BarbotScreen';
import BottleTutorial from './src/tutorials/BottleTutorial';
import SettingsScreen from './src/screens/SettingsScreen';
import EditRecipeScreen from './src/screens/EditRecipeScreen';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';

const App = () => {
  console.disableYellowBox = true; //REMOVE AFTER TESTING

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },

    ManageBarbot: {
      screen: BarbotScreen,
    },

    BottleTut: {
      screen: BottleTutorial,
    },

    Settings: {
      screen: SettingsScreen,
    },

    EditRecipe: {
      screen: EditRecipeScreen,
    },
  },
  {
    initialRouteName: 'Home',
  },
);

export default App;
