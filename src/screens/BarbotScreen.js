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
} from 'react-native';
import {Button, Overlay, Icon, CheckBox} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import HeaderComponent from '../components/HeaderComponent';
import Spacer from '../components/Spacer';
import {
  addNewBottle,
  getAllBottles,
  addRecipe,
  cleanPumps,
  removeAllBottles,
  checkAlcoholMode,
  setAlcoholMode,
} from '../api/Control';
import IngredientItem from '../components/IngredientItem';
import {toUpper} from '../utils/Tools';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

const recipeOverlayWidth = screenWidth / 1.2;
//const recipeOverlayHeight = screenHeight/1.2;
const recipeOverlayHeight = 570;
const iconScale = 0.8;

class BarbotScreen extends React.Component {
  static navigationOptions = {
    header: <HeaderComponent backVisible={true} />,
  };

  componentDidMount() {
    this.loadBottleList();
    checkAlcoholMode().then(res => {
      this.setState({
        alcoholMode: res,
      });
    });
  }

  loadBottleList() {
    getAllBottles().then(response => {
      var fullList = [];

      for (var i = 0; i < response.length; i++) {
        fullList.push({
          id: i,
          name: response[i],
        });
      }

      //console.log(fullList);

      this.setState({
        fullBottleList: fullList,
      });
    });
  }

  state = {
    newBottleVisible: false,
    newRecipeVisible: false,
    inputBottle: '',
    recipeName: '',
    recipeIngredients: [],
    recipeAmounts: [],
    fullBottleList: [],
    ingredientCount: 0,
    alcoholMode: false,
    alcoholCheck: false,
  };

  setIngredValue(ingredient) {
    this.setState({
      ingredientCount: this.state.ingredientCount + 1,
    });
    this.state.recipeIngredients.push(ingredient);
    this.forceUpdate();
  }

  setAmountValue(amount) {
    this.state.recipeAmounts.push(amount);
    this.forceUpdate();
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Text style={styles.headerText}>Manage Menu</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
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

          <Spacer width={35} />

          <TouchableOpacity
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
            onPress={() => {
              setAlcoholMode(!this.state.alcoholMode)
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
            <ImageBackground
              style={{height: 120 * iconScale, width: 120 * iconScale}}
              source={require('../assets/alcoholModeIcon.png')}
            />
            <Text style={styles.iconText}>
              {this.state.alcoholMode
                ? 'Disable\n Alcohol Mode'
                : 'Enable\n Alcohol Mode'}
            </Text>
          </TouchableOpacity>

          <Spacer width={30} />

          <TouchableOpacity
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
                      cleanPumps();
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
              );
              this.setState({
                newBottleVisible: false,
                inputBottle: '',
                alcoholCheck: false,
              });
            }}
          />
        </Overlay>

        <Overlay
          isVisible={this.state.newRecipeVisible}
          width={recipeOverlayWidth}
          height={recipeOverlayHeight}
          overlayStyle={styles.overlay}>
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

          <Text style={styles.subtext}>Ingredients</Text>
          <Spacer height={5} />

          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              maxHeight: 80,
              height:
                this.state.ingredientCount * 25 < 80
                  ? this.state.ingredientCount * 25
                  : 80,
            }}>
            <ScrollView
              bounces={true}
              contentContainerStyle={{
                maxWidth: recipeOverlayWidth - 20,
                width: recipeOverlayWidth - 20,
                backgroundColor: 'gray',
                borderRadius: 10,
                borderColor: 'black',
                borderWidth: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'space-between',
                  justifyContent: 'space-evenly',
                }}>
                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  {this.state.recipeIngredients.map(ingredient => (
                    <Text style={styles.ingredientText}>
                      {toUpper(ingredient)}
                    </Text>
                  ))}
                </View>

                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                  {this.state.recipeAmounts.map(amount => (
                    <Text style={styles.ingredientText}>{toUpper(amount)}</Text>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>

          <Spacer height={5} />

          <IngredientItem
            bottleItems={this.state.fullBottleList}
            overlayWidth={recipeOverlayWidth}
            ingredCallback={this.setIngredValue.bind(this)}
            amountCallback={this.setAmountValue.bind(this)}
          />

          <Spacer height={15} />
          <Button
            title="Save Recipe"
            buttonStyle={styles.buttonStyle}
            onPress={() => {
              if (
                this.state.recipeName !== '' &&
                this.state.recipeIngredients.length > 0 &&
                this.state.recipeAmounts.length > 0
              ) {
                var saveName = this.state.recipeName;
                var res = addRecipe(
                  this.state.recipeName,
                  this.state.recipeIngredients,
                  this.state.recipeAmounts,
                ).then(() => {
                  if (res === true) {
                    Alert.alert(
                      'Success',
                      'Successfully added ' + saveName + ' recipe!',
                      [
                        {
                          text: 'OK',
                          onPress: this.props.navigation.state.params.reloadMenu(),
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

                console.log('RES: ' + toString(res));
              } else {
                Alert.alert('You must fill out all the appropriate fields!');
              }
            }}
          />
        </Overlay>

        <View style={styles.buttonRow}>
          <TouchableOpacity
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
                      console.log('Starting removal of all bottles...');
                      removeAllBottles().then(response => {
                        if (response === 'true') {
                          this.props.navigation.state.params.resetBottles();
                          Alert.alert('Successfully removed all bottles!');
                        } else if (response === 'busy') {
                          Alert.alert(
                            'BarBot is busy right now! Try again soon.',
                          );
                        } else {
                          Alert.alert('Failed to remove all bottles!');
                        }
                      });
                    },
                  },
                ],
              );
            }}>
            <ImageBackground
              style={{height: 120 * iconScale, width: 120 * iconScale}}
              source={require('../assets/removeAllIcon.png')}
            />
            <Text style={styles.iconText}>{'Remove\n All Bottles'}</Text>
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
    textAlign: 'center',
  },
});
