/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Alert,
  TextInput,
  ImageBackground,
  Text,
  Dimensions,
  StyleSheet,
  AsyncStorage,
  AppState,
} from 'react-native';
import {Overlay, Icon, Button} from 'react-native-elements';
import Spacer from './Spacer';
import {
  getBottlePercent,
  getBottleName,
  removeBottle,
  addBottle,
  getCurrentBottleVolume,
  getInitBottleVolume,
  pumpOn,
  pumpOff,
  pressureOn,
  pressureOff,
} from '../api/Control';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {toUpper} from '../utils/Tools';
import ProgressBar from '../components/ProgressBar';
import {withNavigation} from 'react-navigation';
import CalibrationBody, {calibrationSlideCount} from './CalibrationBody';
import SearchableSelect from './SearchableSelect';
import LoadingComponent from '../components/LoadingComponent';
import AbortController from 'abort-controller';

const scaleFactor = 1.5;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

var overlayWidth = screenWidth / 1.2;
//var overlayHeight = screenHeight/1.4;
var overlayHeight = 500;

var abortController = new AbortController();
var aborted = false;

class BottleStatus extends React.Component {
  constructor(props) {
    super(props);
    this.reloadPercentage();
  }

  _isMounted = false;
  interval = undefined;

  state = {
    level: 'N/A',
    textColor: 'black',
    detailsVisible: false,
    calibrateVisible: false,
    bottleName: 'N/A',
    currentVolume: 'N/A',
    initVolume: 'N/A',
    inputInitVolume: '',
    inputCurrentVolume: '',
    slideNum: 1,
    selectedItem: '',
    isLoading: false,
    isRemoving: false,
    isAdding: false,
    loadingTitle: '',
    loadingMessage: '',
  };

  //Gets the color for the bottle percentage display
  getTextColor(num) {
    if (num > 50) {
      return 'limegreen';
    } else if (num > 15 && num < 50) {
      return 'yellow';
    } else if (num === 'N/A') {
      return 'black';
    } else {
      return 'red';
    }
  }

  //Callback for opening main overlay again after loading
  doneCallback() {
    this.setState({
      detailsVisible: true,
    });
  }

  //Reloads the percentage for the bottle
  reloadPercentage() {
    if (this.state.bottleName !== 'N/A') {
      //Refresh the bottle percentage
      getBottlePercent(this.state.bottleName)
        .then(response => {
          //console.log(response)
          if (this._isMounted) {
            this.setState({
              level: response,
              textColor: this.getTextColor(response),
            });
          }
        })
        .catch(error => {
          this.setState({
            level: 'N/A',
            textColor: 'black',
          });
        });
    }

    //Refresh the bottle currentVolume
    this.setBottleVolumes();
  }

  //Resets BottleStatus component
  resetBottle() {
    this.props.reloadCallback();
    this.reloadPercentage();
    this.setState({
      bottleName: 'N/A',
      currentVolume: 'N/A',
      initVolume: 'N/A',
      level: 'N/A',
      textColor: 'black',
    });
  }

  //Sets the volumes of the current bottle
  setBottleVolumes() {
    if (this.state.bottleName !== 'N/A') {
      //Set current volume
      getCurrentBottleVolume(this.state.bottleName)
        .then(response => {
          //console.log('Current bottle volume: ' + response);
          if (this._isMounted) {
            this.setState({
              currentVolume: response,
            });
          }
        })
        .catch(error => {
          console.log(error);
          if (this._isMounted) {
            this.setState({
              currentVolume: 'N/A',
            });
          }
        });

      //Set Initial volume
      getInitBottleVolume(this.state.bottleName).then(response => {
        //console.log('Initial Volume: ' + response);
        if (this._isMounted) {
          this.setState({
            initVolume: response,
          });
        }
      });
    }
  }

  //Open the instructions for remove/adding a new bottle
  openInstructions() {
    this.props.navigation.navigate('BottleTut', {
      bottleReturn: this.props.number,
      doneCallback: this.doneCallback.bind(this),
    });
    this.setState({
      detailsVisible: false,
    });
  }

  //Makes sure that volume input is only numbers
  processVolumeInput(text, current) {
    var isNum = /^\d*$/.test(text);
    if (isNum !== true) {
      Alert.alert('Only numbers are a valid input');
    } else {
      if (current) {
        this.setState({
          inputCurrentVolume: text,
        });
      } else {
        this.setState({
          inputInitVolume: text,
        });
      }
    }
  }

  //Show bottle instructions on the first time you open a this overlay
  async getShowInstructions() {
    try {
      var show = await AsyncStorage.getItem('bottleInstructionsShow');

      if (show === 'false') {
        console.log('Not showing instructions');
      } else {
        //TODO: ADD THIS BACK AFTER WE DETERMINE WHETHER IT WORKS OR NOT
        this.openInstructions();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Set's the current bottle's name
  setBottleName() {
    //Set the bottle name
    getBottleName(this.props.number)
      .then(response => {
        if (this._isMounted) {
          this.setState({
            bottleName: response,
          });
        }
        //console.log('BOTTLE NAME: ' + response);
      })
      .then(() => {
        if (this._isMounted) {
          //Set the bottle volumes the first time
          this.setBottleVolumes();
          this.reloadPercentage();
        }
      });
  }

  componentDidMount() {
    this._isMounted = true;
    AppState.addEventListener('change', this.handleBackgroundApp.bind(this));
    this.setBottleName();

    //Continously reload bottle percentage
    this.interval = setInterval(() => {
      this.reloadPercentage();
    }, 30000);

    //Need to trigger tutorial if this is the first time seeing this
    //this.getShowInstructions();
    //TODO: Removed temporarily
  }

  componentDidUpdate() {
    if (this.props.reload) {
      this.resetBottle();
    }
  }

  //Signify that component has been unmounted to prevent memory leaks
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleBackgroundApp.bind(this));
    clearInterval(this.interval);
  }

  //Handles app going into the background (cancels API requests)
  handleBackgroundApp(nextAppState) {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      abortController.abort();
      abortController = new AbortController();
      this.setState({
        selectedItem: '',
        inputCurrentVolume: '',
        inputInitVolume: '',
        isLoading: false,
        isAdding: false,
        isRemoving: false,
        detailsVisible: false,
      });

      this._isMounted = false;
    } else if (nextAppState === 'active') {
      this._isMounted = true;
      if (this.aborted) {
        this.aborted = false;
        this.resetBottle();
        this.setBottleName();
        this.reloadPercentage();
        this.props.reloadCallback();
      }
    }
  }

  render() {
    return (
      <View>
        <LoadingComponent
          title={this.state.loadingTitle}
          message={this.state.loadingMessage}
          visible={this.state.isLoading}
        />
        <TouchableOpacity
          onPress={() => {
            this.setState({
              detailsVisible: true,
            });
            //console.log('Item: ' + this.state.selectedItem);
          }}>
          <View style={{paddingHorizontal: 0.8}}>
            <ImageBackground
              style={{height: 71 * scaleFactor, width: 30 * scaleFactor}}
              source={
                this.props.pumpType === 'soda'
                  ? require('../assets/sparklingBottle.png')
                  : require('../assets/bottleIcon.png')
              }>
              <Spacer height={70} />
              <Text style={{textAlign: 'center', color: this.state.textColor}}>
                {this.state.level}
              </Text>
            </ImageBackground>
            <Text style={{textAlign: 'center'}}>{this.props.number}</Text>
          </View>
        </TouchableOpacity>

        <Overlay
          isVisible={this.state.detailsVisible}
          width={overlayWidth}
          height={overlayHeight}
          overlayStyle={styles.overlay}>
          <>
            <View style={styles.backButtonRow}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    detailsVisible: false,
                    selectedItem: '',
                    inputInitVolume: '',
                    inputCurrentVolume: '',
                  });

                  //console.log('CLOSE Item: ' + this.state.selectedItem);
                }}>
                <Icon name="back" size={33} type="antdesign" />
              </TouchableOpacity>
            </View>
            <Text style={styles.headerStyle}>
              {this.state.bottleName === 'N/A'
                ? 'Add New Bottle'
                : toUpper(this.state.bottleName)}
            </Text>

            <View style={styles.bodyContainer}>
              {this.state.bottleName !== 'N/A' && (
                <View>
                  <View style={styles.progressContainer}>
                    <Text
                      style={{paddingTop: 6, paddingRight: 5, fontSize: 16}}>
                      Level:
                    </Text>
                    <ProgressBar
                      width={220}
                      height={30}
                      value={this.state.level === 'N/A' ? 0 : this.state.level}
                    />
                    <Spacer height={40} />
                  </View>

                  <View style={styles.statsContainer}>
                    <Text style={styles.textStyle}>
                      Remaining Volume: {this.state.currentVolume} [mL]
                    </Text>
                    <Text style={styles.textStyle}>
                      Original Volume: {this.state.initVolume} [mL]
                    </Text>
                  </View>

                  <View
                    style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <Text
                      style={{
                        textDecorationLine: 'underline',
                        fontSize: 18,
                        textAlign: 'center',
                        alignSelf: 'center',
                        paddingRight: 10,
                        paddingLeft: 30,
                      }}>
                      Bottle Management
                    </Text>
                    {
                      //TODO: ICON TEMPORARILY DISABLED FOR RELEASE ISSUE FIX
                    }
                    <Icon
                      name="help"
                      disabled={true}
                      size={28}
                      onPress={() => {
                        //this.openInstructions();
                      }}
                    />
                  </View>
                </View>
              )}

              {this.state.bottleName !== 'N/A' && (
                <View style={styles.buttonContainer}>
                  <Button
                    title="Remove Bottle"
                    buttonStyle={styles.buttonStyle}
                    onPress={async () => {
                      this.setState({
                        loadingMessage: 'Please wait while bottle is removed.',
                        loadingTitle: 'Removing Bottle',
                        detailsVisible: false,
                        isLoading: true,
                        isRemoving: true,
                      });
                      removeBottle(
                        this.props.number,
                        this.state.bottleName,
                        abortController.signal,
                      )
                        .then(res => {
                          if (res === 'true') {
                            this.resetBottle();
                          } else if (res === 'busy') {
                            console.log('Barbot is busy...');
                          } else {
                            console.log(
                              'Error removing bottle ' +
                                this.state.bottleName +
                                ': ' +
                                res,
                            );
                          }

                          this.setState(
                            {
                              isLoading: false,
                              isRemoving: false,
                              detailsVisible: true,
                            },
                            res === 'busy'
                              ? () => {
                                  setTimeout(() => {
                                    Alert.alert(
                                      'BarBot is busy! Try again soon.',
                                    );
                                  }, 500);
                                }
                              : () => {},
                          );
                        })
                        .catch(error => {
                          if (error.name === 'AbortError') {
                            this.aborted = true;
                          } else {
                            console.log(
                              'Error removing bottle ' +
                                this.state.bottleName +
                                ': ' +
                                error,
                            );
                            this.setState({
                              isLoading: false,
                              isRemoving: false,
                              detailsVisible: true,
                            });
                            Alert.alert('Error removing bottle: ' + error);
                          }
                        });
                    }}
                  />
                  <Spacer height={10} />
                  <Button
                    title="Prime Bottle"
                    buttonStyle={styles.buttonStyle}
                    onPressIn={() => {
                      pumpOn(this.props.number);
                    }}
                    onPressOut={() => {
                      pumpOff(this.props.number);
                    }}
                  />
                  <Spacer height={10} />
                  <Button
                    title={'Calibrate Pump ' + this.props.number}
                    buttonStyle={styles.buttonStyle}
                    onPress={() => {
                      this.setState({
                        detailsVisible: false,
                        calibrateVisible: true,
                      });
                    }}
                  />
                  {this.props.pumpType === 'soda' && (
                    <Button
                      title={'Pressurize'}
                      buttonStyle={[styles.buttonStyle, {marginTop: 10}]}
                      onPressIn={() => {
                        pressureOn(this.props.number);
                      }}
                      onPressOut={() => {
                        pressureOff(this.props.number);
                      }}
                    />
                  )}
                </View>
              )}
              {this.state.bottleName === 'N/A' && (
                <View style={styles.buttonContainer}>
                  <SearchableSelect
                    data={this.props.bottleItems}
                    selectItemCallback={item => {
                      this.setState({
                        selectedItem: item,
                      });
                    }}
                    placeholder={'Select a bottle...'}
                    width={overlayWidth / 1.4}
                  />
                  <Spacer height={10} />
                  <Text style={styles.textStyle}>
                    Current Bottle Volume (mL):
                  </Text>
                  <TextInput
                    style={{
                      width: overlayWidth / 3,
                      height: 30,
                      backgroundColor: 'white',
                      borderColor: 'gray',
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    keyboardType="number-pad"
                    onChangeText={text => {
                      this.processVolumeInput(text, true);
                    }}
                    maxLength={4}
                    value={this.state.inputCurrentVolume}
                  />

                  <Spacer height={10} />
                  <Text style={styles.textStyle}>
                    Initial Bottle Volume (mL):
                  </Text>
                  <TextInput
                    style={{
                      width: overlayWidth / 3,
                      height: 30,
                      backgroundColor: 'white',
                      borderColor: 'gray',
                      borderWidth: 1,
                      borderRadius: 5,
                    }}
                    keyboardType="number-pad"
                    onChangeText={text => {
                      this.processVolumeInput(text, false);
                    }}
                    maxLength={4}
                    value={this.state.inputInitVolume}
                  />
                  <Spacer height={10} />

                  <Button
                    title="Add Bottle"
                    disabled={
                      this.state.selectedItem === '' ||
                      this.state.inputCurrentVolume === '' ||
                      this.state.inputInitVolume === ''
                    }
                    buttonStyle={styles.buttonStyle}
                    onPress={async () => {
                      //Validate input volumes (Technically not possible to be less than zero, but leaving here in case changes are made to numpad input)
                      if (this.state.inputCurrentVolume < 0) {
                        Alert.alert('Current Volume cannot be less than 0!');
                        return;
                      } else if (this.state.inputInitVolume < 0) {
                        Alert.alert('Initial Volume cannot be less than 0!');
                        return;
                      } else if (
                        parseFloat(this.state.inputCurrentVolume) >
                        parseFloat(this.state.inputInitVolume)
                      ) {
                        Alert.alert(
                          'Current volume cannot be larger than initial volume!',
                        );
                        return;
                      }

                      this.setState({
                        loadingMessage: 'Please wait while bottle is added.',
                        loadingTitle: 'Adding Bottle',
                        isLoading: true,
                        isAdding: true,
                        detailsVisible: false,
                      });

                      addBottle(
                        this.state.selectedItem,
                        this.props.number,
                        this.state.inputCurrentVolume,
                        this.state.inputInitVolume,
                        abortController.signal,
                      )
                        .then(res => {
                          //console.log('ADDING BOTTLE RESULT: ' + res);
                          if (res === 'false') {
                            Alert.alert(
                              'There was an error adding your bottle. Please try again later',
                            );
                          }

                          this.setState({
                            selectedItem: '',
                            inputCurrentVolume: '',
                            inputInitVolume: '',
                            isLoading: false,
                            isAdding: false,
                            detailsVisible: true,
                          });

                          this.setBottleName();
                          this.props.reloadCallback();
                          this.reloadPercentage();
                        })
                        .catch(err => {
                          if (err.name === 'AbortError') {
                            this.aborted = true;
                          } else {
                            console.log(err);

                            this.setState({
                              selectedItem: '',
                              inputCurrentVolume: '',
                              inputInitVolume: '',
                              isLoading: false,
                              isAdding: true,
                              detailsVisible: true,
                            });

                            this.setBottleName();
                            this.props.reloadCallback();
                            this.reloadPercentage();
                          }
                        });
                    }}
                  />
                </View>
              )}
            </View>
          </>
        </Overlay>

        <Overlay
          isVisible={this.state.calibrateVisible}
          width={overlayWidth}
          height={overlayHeight}
          overlayStyle={styles.overlay}>
          <>
            <View style={styles.backButtonRow}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    detailsVisible: true,
                    calibrateVisible: false,
                    slideNum: 1,
                    selectedItem: '',
                  });
                }}>
                <Icon name="back" size={33} type="antdesign" />
              </TouchableOpacity>
            </View>

            <Text style={styles.headerStyle}>
              {'Calibrate Pump ' + this.props.number}
            </Text>
            <Spacer height={10} />
            <CalibrationBody
              slide={this.state.slideNum}
              pumpNum={this.props.number}
            />

            <View style={styles.calibrateControl}>
              {this.state.slideNum > 1 && (
                <Button
                  title="Prev"
                  buttonStyle={styles.calibrateButtons}
                  onPress={() => {
                    this.setState({
                      slideNum: this.state.slideNum - 1,
                    });
                  }}
                />
              )}

              {this.state.slideNum < calibrationSlideCount && (
                <Button
                  title="Next"
                  buttonStyle={styles.calibrateButtons}
                  onPress={() => {
                    this.setState({
                      slideNum: this.state.slideNum + 1,
                    });
                  }}
                />
              )}

              {this.state.slideNum === calibrationSlideCount && (
                <Button
                  title="Done"
                  buttonStyle={styles.calibrateButtons}
                  onPress={() => {
                    this.setState({
                      detailsVisible: true,
                      calibrateVisible: false,
                      slideNum: 1,
                    });
                  }}
                />
              )}
            </View>
          </>
        </Overlay>
      </View>
    );
  }
}

export default withNavigation(BottleStatus);

const styles = StyleSheet.create({
  overlay: {
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },

  backButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },

  headerStyle: {
    fontSize: 20,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

  bodyContainer: {
    flexDirection: 'column',
    paddingTop: 10,
  },

  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    width: overlayWidth,
  },

  buttonContainer: {
    alignSelf: 'center',
    paddingTop: 20,
    alignItems: 'center',
  },

  calibrateButtons: {
    borderRadius: 20,
    width: 70,
    backgroundColor: '#7295A6',
  },

  statsContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 2,
    width: overlayWidth,
    right: 10,
  },

  textStyle: {
    fontSize: 18,
    paddingLeft: 10,
  },

  buttonStyle: {
    borderRadius: 20,
    width: 175,
    backgroundColor: '#7295A6',
  },

  calibrateControl: {
    paddingTop: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
