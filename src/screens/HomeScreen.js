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

var manageVisible = true;

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

  setCocktailMenu() {
    getCocktailMenu()
      .then(response => {
        this.setState({
          cocktailMenu: response,
        });
        console.log('Cocktail Menu:');
        console.log(response);
      })
      .catch(error => console.log(error));

    this.forceUpdate();
  }

  //Load bottle list from the BarBot controller and formats it for the drop down menu
  loadBottleList() {
    getNewBottles().then(list => {
      var newList = [];
      for (var i = 0; i < list.length; i++) {
        newList.push({
          id: i,
          name: list[i],
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
    console.log('Reloaded');
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

    if (this.state.reloadMenu) {
      this.reloadCallback();
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        reloadMenu: false,
      });
    }
  }

  state = {
    cocktailMenu: [],
    bottleList: [],
    reload: false,
    reloadMenu: false,
    cocktailThumbnails: {},
    bottleCount: 0, //8 is the default and then is updated by API request
    pumpDetails: [],
  };

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.statusView}>
          {/*<Text style={styles.textStyle}>Your BarBot</Text>*/}
          {/*<Text style={styles.infoText}>Connection Status:</Text>*/}
          <ConnectionStatus />
          {false && <Text style={styles.infoText}>Online/Offline:</Text>}
          <Spacer height={10} />
          {/*<Text style={{fontSize: 18, textDecorationLine: 'underline'}}>Ingredient Status:</Text>
                        <Spacer height={10} /> */}
          <View style={styles.bottleContainer}>
            <ScrollView
              horizontal={true}
              scrollEnabled={this.state.bottleCount > 8 ? true : false}
              keyboardShouldPersistTaps="handled">
              {this.state.pumpDetails.map(pumpObj => (
                <BottleStatus
                  number={pumpObj.pumpNum}
                  pumpType={pumpObj.type}
                  pumpTime={pumpObj.pumpTime}
                  reload={this.state.reload}
                  bottleItems={this.state.bottleList}
                  reloadCallback={this.reloadCallback.bind(this)}
                />
              ))}
            </ScrollView>
          </View>

          <Spacer height={5} />
          {manageVisible && (
            <Button
              title="Manage BarBot"
              buttonStyle={styles.manageButton}
              titleStyle={{fontSize: 16}}
              onPress={() => {
                this.props.navigation.navigate('ManageBarbot', {
                  resetBottles: () => {
                    this.setState({
                      reload: true,
                    });
                  },
                  reloadMenu: () => {
                    this.setState({
                      reloadMenu: true,
                    });
                  },
                });
              }}
            />
          )}
        </View>
        <Spacer height={20} />
        <View style={styles.controlView}>
          <Text style={styles.textStyle}>Menu</Text>
          <ScrollView bounces={true} contentContainerStyle={styles.menuScroll}>
            <Spacer height={10} />

            {this.state.cocktailMenu.map(cocktail => (
              <View>
                <MenuItem
                  name={toUpper(cocktail)}
                  reloadCallback={this.reloadCallback.bind(this)}
                />
                <Spacer height={20} />
              </View>
            ))}
          </ScrollView>
        </View>
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
});

export default withNavigationFocus(HomeScreen);
