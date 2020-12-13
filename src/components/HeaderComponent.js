/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaView} from '@react-navigation/compat';
import {useNavigation} from '@react-navigation/native';
import {Icon} from 'react-native-elements';

export default function HeaderComponent(props) {
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const navigation = useNavigation();

  if (props.backVisible || props.settingsVisible) {
    return (
      <SafeAreaView style={styles.safeStyle}>
        <View style={styles.backContainer}>
          <View style={styles.buttonContainer}>
            {props.backVisible && (
              <Button
                title="Go Back"
                buttonStyle={styles.buttonStyle}
                titleStyle={{
                  color: 'black',
                  fontSize: 18,
                }}
                onPress={() => {
                  //console.log('Return page: ' + props.returnPage);
                  if (props.returnPage === 'ManageBarbot') {
                    navigation.navigate('ManageBarbot');
                  } else {
                    navigation.navigate('Home');
                    var routes = navigation.state.routes;

                    //Find reloadCallback in route params
                    for (var i in routes) {
                      if (routes[i].routeName === 'Home') {
                        routes[i].params.reloadCallback();
                        break;
                      }
                    }
                  }
                }}
              />
            )}
          </View>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => {
              if (props.reloadCallback !== undefined) {
                if (!refreshDisabled) {
                  props.reloadCallback();
                  setRefreshDisabled(true);

                  setTimeout(() => {
                    setRefreshDisabled(false);
                  }, 2000);
                }
              }
            }}>
            <Text style={styles.textStyle}>BarBot</Text>
          </TouchableOpacity>
          <View style={styles.rightSide}>
            {props.settingsVisible && (
              <Icon
                name="settings"
                size={32}
                onPress={() => {
                  navigation.navigate('Settings');
                }}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.safeStyle}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => {
              if (!refreshDisabled) {
                props.reloadCallback();
                setRefreshDisabled(true);

                setTimeout(() => {
                  setRefreshDisabled(false);
                }, 2000);
              }
            }}>
            <Text style={styles.textStyle}>BarBot</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C404F',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },

  backContainer: {
    backgroundColor: '#1C404F',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    flexDirection: 'row',
  },

  safeStyle: {
    backgroundColor: '#1C404F',
  },

  buttonContainer: {
    flex: 1,
  },

  buttonStyle: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    marginLeft: 15,
  },

  textContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flex: 1,
  },

  rightSide: {
    flex: 1,
  },

  textStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 28,
    fontFamily: 'Chalkboard SE',
  },
});
