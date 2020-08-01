/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  AppState,
} from 'react-native';
import {Button, Overlay, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {withNavigation} from 'react-navigation';
import HeaderComponent from '../components/HeaderComponent';
import Spacer from '../components/Spacer';
import {
  addNewBottle,
  refreshRecipes,
  addRecipe,
  cleanPumps,
  removeAllBottles,
  checkAlcoholMode,
  setAlcoholMode,
  updateBarbot,
  rebootBarbot,
} from '../api/Control';
import {toUpper} from '../utils/Tools';
import EditIngredientsComponent from '../components/EditIngredientsComponent';
import LoadingComponent from '../components/LoadingComponent';
import AbortController from 'abort-controller';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
var abortController = new AbortController();
var aborted = false;

const recipeOverlayWidth = screenWidth / 1.2;
//const recipeOverlayHeight = screenHeight/1.2;
const recipeOverlayHeight = 570;
const iconScale = 0.8;
const buttonSpacing = 30;

class BarbotScreen extends React.Component {
  static navigationOptions = {
    header: <HeaderComponent backVisible={true} />,
  };

  componentDidMount() {
    AppState.addEventListener('change', this.handleBackgroundApp);
    checkAlcoholMode().then(res => {
      this.setState({
        alcoholMode: res,
      });
    });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleBackgroundApp);
  }

  handleBackgroundApp(nextAppState) {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      abortController.abort();
      abortController = new AbortController();
    } else if (nextAppState === 'active') {
      if (aborted) {
        aborted = false;
      }
    }
  }

  state = {
    newBottleVisible: false,
    newRecipeVisible: false,
    inputBottle: '',
    recipeName: '',
    recipeIngredients: [],
    recipeAmounts: [],
    ingredientCount: 0,
    alcoholMode: false,
    alcoholCheck: false,
    loadingMessage: '',
    loadingTitle: '',
    showLoading: false,
  };

  //Callback for EditIngredients Component
  saveRecipe(recipeIngreds, recipeAmts) {
    if (
      this.state.recipeName !== '' &&
      recipeIngreds.length > 0 &&
      recipeAmts.length > 0
    ) {
      var saveName = this.state.recipeName;
      addRecipe(
        this.state.recipeName,
        recipeIngreds,
        recipeAmts,
        abortController.signal,
      ).then(res => {
        //console.log('Add Recipe result: ' + res);
        if (res === true) {
          Alert.alert(
            'Success',
            'Successfully added ' + saveName + ' recipe!',
            [
              {
                text: 'OK',
                onPress: () => {
                  refreshRecipes()
                    .then(res => {
                      this.props.navigation.state.params.reloadMenu();
                    })
                    .catch(err => {
                      console.log(err);
                      this.props.navigation.state.params.reloadMenu();
                    });
                },
              },
            ],
          );
        } else {
          Alert.alert(
            'Failed to add ' + saveName + ' recipe! Try again later.',
          );
        }
      });
      this.setState({
        newRecipeVisible: false,
        recipeName: '',
        recipeIngredients: [],
        recipeAmounts: [],
        ingredientCount: 0,
      });
    } else {
      Alert.alert('You must fill out all the appropriate fields!');
    }
  }

  render() {
    return (
      <View style={styles.mainView}>
        <LoadingComponent
          title={this.state.loadingTitle}
          message={this.state.loadingMessage}
          visible={this.state.showLoading}
        />
        <Text style={styles.headerText}>Settings</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.opacityStyle}
            onPress={() => {
              this.setState({
                newBottleVisible: true,
              });
            }}>
            <ImageBackground
              style={{height: 120 * iconScale, width: 120 * iconScale}}
              source={require('../assets/newBottleIcon.png')}
            />
            <Text style={styles.iconText}>New Bottle</Text>
          </TouchableOpacity>

          <Spacer width={buttonSpacing} />

          <TouchableOpacity
            style={styles.opacityStyle}
            onPress={() => {
              this.setState({
                newRecipeVisible: true,
              });
            }}>
            <ImageBackground
              style={{height: 120 * iconScale, width: 120 * iconScale}}
              source={require('../assets/menuIcon.png')}
            />
            <Text style={styles.iconText}>New Recipe</Text>
          </TouchableOpacity>
        </View>

        <Spacer height={35} />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.opacityStyle}
            onPress={() => {
              setAlcoholMode(!this.state.alcoholMode, abortController.signal)
                .then(() => {
                  this.props.navigation.state.params.reloadMenu();
                  this.setState({
                    alcoholMode: !this.state.alcoholMode,
                  });
                })
                .catch(error => {
                  console.log(error);
                  Alert.alert('There was an error switching to Alcohol Mode');
                });
            }}>
            <Icon name="pencil" type="fontawesome" size={90} />
            <Text style={styles.iconText}>
              {this.state.alcoholMode
                ? 'Disable Alcohol Mode'
                : 'Enable Alcohol Mode'}
            </Text>
          </TouchableOpacity>

          <Spacer width={buttonSpacing} />

          <TouchableOpacity
            style={styles.opacityStyle}
            onPress={() => {
              Alert.alert(
                'Confirm Pump Flush',
                'This will flush all pumps for 10 seconds. Be sure to remove all bottles and replace with water prior to flushing! Are you sure you want to continue?',
                [
                  {
                    text: 'Cancel',
                    onPress: () => console.log('User canceled pump flush!'),
                    style: 'cancel',
                  },
                  {
                    text: 'Confirm',
                    onPress: () => {
                      console.log('Starting flush of all pumps...');
                      this.setState({
                        showLoading: true,
                        loadingMessage: 'Flushing your ingredient pumps...',
                        loadingTitle: 'Flushing Pumps',
                      });
                      cleanPumps(abortController.signal)
                        .then(res => {
                          this.setState({
                            showLoading: false,
                            loadingMessage: '',
                            loadingTitle: '',
                          });
                        })
                        .catch(err => {
                          console.log(err);
                          this.setState({
                            showLoading: false,
                            loadingMessage: '',
                            loadingTitle: '',
                          });
                        });
                    },
                  },
                ],
              );
            }}>
            <ImageBackground
              style={{height: 120 * iconScale, width: 120 * iconScale}}
              source={require('../assets/flushIcon.png')}
            />
            <Text style={styles.iconText}>Flush Pumps</Text>
          </TouchableOpacity>
        </View>
        <Spacer height={70} />

        <Overlay
          isVisible={this.state.newBottleVisible}
          width={screenWidth / 1.3}
          height={265}
          overlayStyle={styles.overlay}>
          <>
            <View style={styles.backButtonRow}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    newBottleVisible: false,
                    alcoholCheck: false,
                  });
                }}>
                <Icon name="back" size={33} type="antdesign" />
              </TouchableOpacity>
            </View>

            <Text style={styles.textStyle}>Add Bottle</Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 18, marginTop: 10}}>Bottle Name: </Text>
              <TextInput
                style={styles.textInput}
                maxLength={24}
                onChangeText={text => {
                  this.setState({
                    inputBottle: text,
                  });
                }}
              />
            </View>
            <Spacer height={10} />
            <CheckBox
              title="Is alcohol?"
              checked={this.state.alcoholCheck}
              containerStyle={{
                borderRadius: 10,
                backgroundColor: 'white',
              }}
              onPress={() => {
                this.setState({
                  alcoholCheck: !this.state.alcoholCheck,
                });
              }}
            />
            <Spacer height={20} />
            <Button
              title="Add Bottle"
              buttonStyle={styles.lightButtonStyle}
              onPress={() => {
                addNewBottle(
                  this.state.inputBottle,
                  this.state.alcoholCheck ? 'true' : 'false',
                  abortController.signal,
                ).then(res => {
                  //console.log(res);
                  if (res === true) {
                    this.setState(
                      {
                        showLoading: false,
                      },
                      () => {
                        setTimeout(() => {
                          Alert.alert('Successfully added new bottle!');
                        }, 500);
                      },
                    );
                  }
                });
                this.setState({
                  newBottleVisible: false,
                  inputBottle: '',
                  alcoholCheck: false,
                  loadingMessage: 'BarBot is adding new bottle...',
                  loadingTitle: 'Adding New Bottle',
                  showLoading: true,
                });
              }}
            />
          </>
        </Overlay>

        <Overlay
          isVisible={this.state.newRecipeVisible}
          width={recipeOverlayWidth}
          height={recipeOverlayHeight}
          overlayStyle={styles.overlay}>
          <>
            <View style={styles.backButtonRow}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    newRecipeVisible: false,
                    recipeName: '',
                    recipeIngredients: [],
                    recipeAmounts: [],
                    ingredientCount: 0,
                  });
                }}>
                <Icon name="back" size={33} type="antdesign" />
              </TouchableOpacity>
            </View>

            <Text style={styles.textStyle}>Add Recipe</Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{fontSize: 18, marginTop: 10}}>Cocktail Name: </Text>
              <TextInput
                style={styles.textInput}
                maxLength={24}
                onChangeText={text => {
                  this.setState({
                    recipeName: text,
                  });
                }}
              />
            </View>
            <Spacer height={15} />

            <EditIngredientsComponent
              recipeIngredients={this.state.recipeIngredients}
              recipeAmounts={this.state.recipeAmounts}
              saveRecipe={this.saveRecipe.bind(this)}
            />
          </>
        </Overlay>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.opacityStyle}
            onPress={() => {
              Alert.alert(
                'Confirm Bottle Removal',
                'This will return all excess ingredients to their respective bottles. Are you sure you want to continue?',
                [
                  {
                    text: 'Cancel',
                    onPress: () =>
                      console.log('User canceled full bottle removal!'),
                    style: 'cancel',
                  },
                  {
                    text: 'Confirm',
                    onPress: () => {
                      //console.log('Starting removal of all bottles...');
                      this.setState({
                        showLoading: true,
                        loadingMessage:
                          'Please wait while BarBot removes your bottles.',
                        loadingTitle: 'Removing Bottles',
                      });

                      removeAllBottles(abortController.signal)
                        .then(response => {
                          this.setState(
                            {
                              showLoading: false,
                            },
                            () => {
                              if (response === 'true') {
                                this.props.navigation.state.params.resetBottles();
                                setTimeout(() => {
                                  Alert.alert(
                                    'Successfully removed all bottles!',
                                  );
                                }, 500);
                              } else if (response === 'busy') {
                                setTimeout(() => {
                                  Alert.alert(
                                    'BarBot is busy right now! Try again soon.',
                                  );
                                }, 500);
                              } else if (response === 'error') {
                                setTimeout(() => {
                                  Alert.alert(
                                    'There was an error trying to remove all bottles!',
                                  );
                                }, 500);
                              } else {
                                setTimeout(() => {
                                  Alert.alert('Failed to remove all bottles!');
                                }, 500);
                              }
                            },
                          );
                        })
                        .catch(err => {
                          if (err.name === 'AbortError') {
                            aborted = true;
                            this.props.navigation.state.params.resetBottles();
                          }
                          console.log(err);
                          this.setState({showLoading: false});
                        });
                    },
                  },
                ],
              );
            }}>
            <Icon name="eject" size={90} />
            <Text style={styles.iconText}>{'Remove\n All Bottles'}</Text>
          </TouchableOpacity>

          <Spacer width={buttonSpacing} />

          <TouchableOpacity
            style={styles.opacityStyle}
            onPress={() => {
              this.props.navigation.navigate('EditRecipe');
            }}>
            <Icon name="edit" size={90} style={{marginLeft: 10}} />
            <Text style={styles.iconText}>{'Manage Recipes'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.buttonRow, {marginTop: 70}]}>
          <TouchableOpacity
            style={styles.opacityStyle}
            onPress={() => {
              Alert.alert(
                'Update BarBot?',
                "Pressing 'Continue' will update BarBot if an update is available. BarBot may reboot itself when updated. Do you want to continue?",
                [
                  {text: 'Go Back', onPress: () => {}},
                  {text: 'Continue', onPress: updateBarbot},
                ],
              );
            }}>
            <Icon name="download" type="antdesign" size={90} />
            <Text style={styles.iconText}>Update BarBot</Text>
          </TouchableOpacity>

          <Spacer width={buttonSpacing} />

          <TouchableOpacity
            style={styles.opacityStyle}
            onPress={() => {
              Alert.alert(
                'Reboot BarBot?',
                "Pressing 'Continue' will reboot BarBot. Do you want to continue?",
                [
                  {text: 'Go Back', onPress: () => {}},
                  {
                    text: 'Continue',
                    onPress: () => {
                      rebootBarbot();
                    },
                  },
                ],
              );
            }}>
            <Icon name="refresh" size={90} />
            <Text style={styles.iconText}>Reboot BarBot</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withNavigation(BarbotScreen);

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
    minWidth: 120,
    maxWidth: 120,
    textAlign: 'center',
  },

  opacityStyle: {
    alignItems: 'center',
  },
});
