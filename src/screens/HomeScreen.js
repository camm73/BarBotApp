/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, View, StyleSheet, Alert, Dimensions} from 'react-native';
import {Button} from 'react-native-elements';
import Spacer from '../components/Spacer';
import {withNavigationFocus} from 'react-navigation';
import {ScrollView} from 'react-native-gesture-handler';
import HeaderComponent from '../components/HeaderComponent';
import MenuItem from '../components/MenuItem';
import {
  getCocktailMenu,
  getNewBottles,
  getPumpSupportDetails,
} from '../api/Control';
import {toUpper} from '../utils/Tools';
import ConnectionStatus from '../components/ConnectionStatus';
import BottleStatus from '../components/BottleStatus';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderComponent
          backVisible={false}
          settingsVisible={false}
          reloadCallback={navigation.getParam('reloadCallback')}
        />
      ),
    };
  };

  //Fetches and sets the available cocktail menu
  setCocktailMenu() {
    if (!this.state.settingMenu) {
      this.setState({
        settingMenu: true,
      });

      getCocktailMenu()
        .then(response => {
          this.setState({
            cocktailMenu: response,
            settingMenu: false,
          });
          //console.log('Cocktail Menu:');
          //console.log(response);
        })
        .catch(error => {
          console.log(error);
          this.setState({
            settingMenu: false,
          });
        });
    }
  }

  //Load bottle list from the BarBot controller and formats it for the drop down menu
  loadBottleList() {
    getNewBottles().then(list => {
      var newList = [];
      for (var i = 0; i < list.length; i++) {
        newList.push({
          id: i.toString(),
          name: list[i],
          value: list[i],
        });
      }

      this.setState({
        bottleList: newList,
      });
    });
  }

  //Called to reload menu and bottle list after exit from bottleStatus
  reloadCallback() {
    this.setState({
      cocktailMenu: [],
      reload: false,
    });
    this.configureBottleShelf();
    this.setCocktailMenu();
    this.loadBottleList();
    this.resetBottles();
    //console.log('Reloaded');
  }

  //Callback for BottleStatus
  reloadBottleCallback() {
    this.setState({
      cocktailMenu: [],
    });
    this.configureBottleShelf();
    this.setCocktailMenu();
    this.loadBottleList();
  }

  //Resets/reloads bottles
  resetBottles() {
    this.setState(
      {
        reload: true,
      },
      () => {
        this.setState({
          reload: false,
        });
      },
    );
  }

  //Configures the bottle shelf based on available pump data
  configureBottleShelf() {
    getPumpSupportDetails().then(res => {
      this.setState({
        pumpDetails: res,
        bottleCount: res.length,
      });
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      reloadCallback: this.reloadCallback.bind(this),
    });

    this.configureBottleShelf();

    this.setCocktailMenu();
    this.loadBottleList();
  }

  componentDidUpdate(prevProps) {
    //Runs when navigating back to the screen
    if (prevProps.isFocused !== this.props.isFocused) {
      this.loadBottleList();
    }
  }

  state = {
    cocktailMenu: [],
    bottleList: [],
    reload: false,
    cocktailThumbnails: {},
    bottleCount: 0, //8 is the default and then is updated by API request
    pumpDetails: [],
    manageVisible: false,
    offline: false,
    settingMenu: false,
  };

  //Callback for ConnectionStatus to manage the display
  toggleConnected(status) {
    if (status === true) {
      this.setState({
        manageVisible: true,
      });
    } else {
      this.setState({
        manageVisible: false,
      });
    }
  }

  render() {
    return (
      <View style={styles.mainView}>
        <ConnectionStatus toggleConnected={this.toggleConnected.bind(this)} />
        {this.state.manageVisible && (
          <>
            <View style={styles.statusView}>
              <View style={styles.bottleContainer}>
                <ScrollView
                  horizontal={true}
                  scrollEnabled={this.state.bottleCount > 8 ? true : false}
                  keyboardShouldPersistTaps="handled">
                  {this.state.pumpDetails.map(pumpObj => (
                    <BottleStatus
                      key={pumpObj.pumpNum}
                      number={pumpObj.pumpNum}
                      pumpType={pumpObj.type}
                      pumpTime={pumpObj.pumpTime}
                      reload={this.state.reload}
                      bottleItems={this.state.bottleList}
                      reloadCallback={this.reloadBottleCallback.bind(this)}
                    />
                  ))}
                </ScrollView>
              </View>
              <Button
                title="Manage BarBot"
                buttonStyle={styles.manageButton}
                titleStyle={{fontSize: 16}}
                onPress={() => {
                  this.props.navigation.navigate('ManageBarbot', {
                    reloadMenu: this.reloadCallback.bind(this),
                  });
                }}
              />
            </View>
            <Spacer height={10} />
            <View style={styles.controlView}>
              <Text style={[styles.textStyle, {marginBottom: 8}]}>Menu</Text>
              <ScrollView
                bounces={true}
                scrollEnabled={
                  this.state.cocktailMenu.length === 0 ? false : true
                }
                contentContainerStyle={styles.menuScroll}>
                {this.state.cocktailMenu.length < 1 && (
                  <View>
                    <Text style={styles.offlineMessage}>
                      There are no items on the menu right now. Try adding more
                      ingredients.
                    </Text>
                  </View>
                )}

                {this.state.cocktailMenu.map(cocktail => (
                  <View key={cocktail}>
                    <MenuItem
                      name={toUpper(cocktail)}
                      reloadCallback={this.reloadCallback.bind(this)}
                      offline={this.state.offline}
                    />
                    <Spacer height={20} />
                  </View>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        {!this.state.manageVisible && (
          <View style={styles.offlineContainer}>
            <Text style={styles.offlineTitle}>
              It appears that BarBot is offline. Please try the following:
            </Text>
            <Text style={styles.offlineMessage}>
              1. Press the "BarBot" Logo at the top of the screen to attempt to
              refresh the connection.
            </Text>
            <Text style={styles.offlineMessage}>
              2. Make sure BarBot is connected to wifi
            </Text>
            <Text style={styles.offlineMessage}>
              3. Ensure your phone is connected to the same network
            </Text>
            <Spacer height={30} />
            {false && (
              <>
                <Text style={styles.offlineTitle}>
                  If these fail, reconfigure wifi settings:
                </Text>
                <Text style={styles.offlineMessage}>
                  1. Check your wifi settings for a wifi network named "BarBot"
                  and connect to it.
                </Text>
                <Text style={styles.offlineMessage}>
                  2. Re-open the BarBot app and you will be able to reconfigure
                  the BarBot wifi settings.
                </Text>
              </>
            )}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: '#617E8C',
    minHeight: screenHeight,
  },

  statusView: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    textAlign: 'center',
    alignItems: 'center',
  },

  bottleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },

  scrollStyle: {
    backgroundColor: 'darkgray',
  },

  controlView: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },

  textStyle: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Courier New',
    textDecorationLine: 'underline',
  },

  infoText: {
    fontSize: 18,
  },

  buttonStyle: {
    width: screenWidth / 2,
    alignSelf: 'center',
  },

  manageButton: {
    backgroundColor: '#3E525C',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,
  },

  menuContainer: {
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  menuScroll: {
    paddingBottom: 90,
    minWidth: screenWidth,
    alignItems: 'center',
  },

  offlineContainer: {
    flex: 1,
    marginTop: 30,
  },

  offlineMessage: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 10,
  },

  offlineTitle: {
    textAlign: 'center',
    fontSize: 18,
    paddingHorizontal: 10,
    textDecorationLine: 'underline',
  },
});

export default withNavigationFocus(HomeScreen);
