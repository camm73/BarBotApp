import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HeaderComponent from './src/components/HeaderComponent';
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
      <RootStack />
    </NavigationContainer>
  );
};

const Stack = createStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{gestureEnabled: false}}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerTitle: 'BarBot',
          headerStyle: {
            backgroundColor: '#1C404F',
          },
          headerTitleStyle: {
            color: 'black',
            fontSize: 26,
            fontFamily: 'Chalkboard SE',
          },
        }}
      />
      <Stack.Screen
        name="ManageBarbot"
        component={BarbotScreen}
        options={{
          headerTitle: 'Manage BarBot',
          headerStyle: {
            backgroundColor: '#1C404F',
          },
          headerTitleStyle: {
            color: 'black',
            fontSize: 22,
            fontFamily: 'Chalkboard SE',
          },
        }}
      />
      <Stack.Screen name="BottleTut" component={BottleTutorial} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen
        name="EditRecipe"
        component={EditRecipeScreen}
        options={{
          headerTitle: 'Edit Recipe',
          headerStyle: {
            backgroundColor: '#1C404F',
          },
          headerTitleStyle: {
            color: 'black',
            fontSize: 22,
            fontFamily: 'Chalkboard SE',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default App;
