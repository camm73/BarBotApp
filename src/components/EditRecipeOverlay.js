/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import {Overlay, Icon, Button} from 'react-native-elements';
import CocktailThumbnailButton from '../components/CocktailThumbnailButton';
import {updateRecipe, deleteRecipe, getIngredients} from '../api/Cloud';
import EditIngredientsComponent from './EditIngredientsComponent';
import {refreshRecipes, updateIgnoreIngredients} from '../api/Control';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

const recipeOverlayWidth = screenWidth / 1.2;
const recipeOverlayHeight = 600;
const imageSize = 100;

const shotSize = 1.5; //fl oz

class EditRecipeOverlay extends React.Component {
  state = {
    recipeName: this.props.cocktailName,
    ingredients: {},
    changeMade: false,
    editIngredients: false,
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    this.loadIngredients();
  }

  //Load ingredients in recipe being editted
  loadIngredients() {
    getIngredients(this.state.recipeName)
      .then(response => {
        if (this._isMounted) {
          this.setState({
            ingredients: response,
          });
        }
      })
      .catch(error => console.log(error));
  }

  //Resets EditRecipeOverlay
  resetComponent() {
    this.loadIngredients();
    if (this._isMounted) {
      this.setState({
        changeMade: false,
      });
    }
  }

  //Gets the amounts for each ingredient in a recipe
  getIngredientAmounts() {
    var amounts = [];
    for (var key in Object.keys(this.state.ingredients)) {
      //console.log(this.state.ingredients[key]);
      amounts.push(this.state.ingredients[key]);
    }

    return amounts;
  }

  //Handles press of ingredient opacity to change whether ingredient is ignored
  handleIgnoreIngredient(ingredient) {
    if (this.props.ignoreIngredients.includes(ingredient)) {
      //Remove from ignore ingredients if confirmed
      Alert.alert(
        'Un-Ignore Ingredient?',
        ingredient + ' is currently ignored. Do you want to un-ignore it?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: () => {
              updateIgnoreIngredients(ingredient, false).then(res => {
                this.props.reloadCallback();
              });
            },
          },
        ],
      );
    } else {
      //Add to ignore ingredients if confirmed
      Alert.alert(
        'Ignore Ingredient?',
        ingredient + ' is not currently ignored. Do you want to ignore it?',
        [
          {
            text: 'Cancel',
            onPress: () => {},
          },
          {
            text: 'Yes',
            onPress: () => {
              updateIgnoreIngredients(ingredient, true).then(res => {
                this.props.reloadCallback();
              });
            },
          },
        ],
      );
    }
  }

  //Callback for EditIngredients Component
  saveIngredients(recipeIngreds, recipeAmts) {
    if (recipeIngreds.length > 0 && recipeAmts.length > 0) {
      var newIngreds = {};

      //console.log(recipeIngreds);
      //console.log(recipeAmts);
      for (var i = 0; i < recipeIngreds.length; i++) {
        newIngreds[recipeIngreds[i]] = parseFloat(recipeAmts[i] / shotSize);
      }

      if (this._isMounted) {
        this.setState({
          ingredients: newIngreds,
          editIngredients: false,
          changeMade: true,
        });
      }
    }
  }

  //Replaces old recipe in dynamodbt
  saveRecipe() {
    updateRecipe(this.state.recipeName, this.state.ingredients)
      .then(res => {
        if (res === true) {
          Alert.alert('Update Success', 'Successfully updated recipe!', [
            {
              text: 'OK',
              onPress: () => {
                refreshRecipes()
                  .then(res => {
                    this.props.reloadCallback();
                  })
                  .catch(err => {
                    console.log(err);
                  });
                this.props.closeCallback();
                this.resetComponent();
                this.props.reloadCallback();
              },
            },
          ]);
        } else {
          this.props.closeCallback();
          this.resetComponent();
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert('There was an error updating recipe!');
      });
  }

  //Make sure setState doesn't run after unmount
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Overlay
        width={recipeOverlayWidth}
        height={recipeOverlayHeight}
        isVisible={this.props.visible}
        overlayStyle={styles.overlay}>
        <>
          <View style={styles.backButtonRow}>
            <TouchableOpacity
              onPress={() => {
                if (this.state.editIngredients) {
                  this.setState({
                    editIngredients: false,
                  });
                } else {
                  if (this.state.changeMade) {
                    Alert.alert(
                      'Save Recipe?',
                      'Do you want to save changes to recipe before exitting?',
                      [
                        {text: 'Go Back', onPress: () => {}},
                        {
                          text: 'Discard Changes',
                          onPress: () => {
                            this.props.closeCallback();
                            this.resetComponent();
                          },
                        },
                        {
                          text: 'Save Changes',
                          onPress: () => {
                            //TODO: Call function to save all changes
                            this.saveRecipe();
                          },
                        },
                      ],
                    );
                  } else {
                    this.props.closeCallback();
                    this.resetComponent();
                  }
                }
              }}>
              <Icon name="back" size={33} type="antdesign" />
            </TouchableOpacity>
          </View>

          <Text style={styles.textStyle}>Edit Recipe</Text>
          {!this.state.editIngredients && (
            <>
              <View style={styles.topSection}>
                <CocktailThumbnailButton
                  name={this.state.recipeName}
                  requestImage={true}
                  imageStyle={styles.imageStyle}
                />
                <View style={styles.topEditContainer}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 18,
                      textDecorationLine: 'underline',
                    }}>
                    {this.state.recipeName}
                  </Text>
                  <Button
                    buttonStyle={styles.deleteButton}
                    title="Delete Cocktail"
                    onPress={() => {
                      Alert.alert(
                        'Confirm Delete',
                        'Are you sure you want to delete this recipe?',
                        [
                          {
                            text: 'Cancel',
                            onPress: () => {},
                          },
                          {
                            text: 'Delete',
                            onPress: () => {
                              //Delete from dynamo (Maybe delete photo from S3 in the future)
                              deleteRecipe(this.state.recipeName).then(res => {
                                if (res === true) {
                                  Alert.alert(
                                    'Removal Success',
                                    'Successfully deleted ' +
                                      this.state.recipeName +
                                      ' from the database.',
                                    [
                                      {
                                        text: 'OK',
                                        onPress: () => {
                                          this.props.closeCallback();
                                          this.resetComponent();
                                          this.props.reloadCallback();
                                          refreshRecipes();
                                        },
                                      },
                                    ],
                                  );
                                } else {
                                  Alert.alert(
                                    'There was an error trying to delete ' +
                                      this.state.recipeName +
                                      ' from the database.',
                                  );
                                }
                              });
                              //TODO: Tell Barbot (and IoT core) to refresh list
                            },
                          },
                        ],
                      );
                    }}
                  />
                </View>
              </View>
              <Text style={styles.textStyle}>Ingredients</Text>

              <View
                style={{
                  maxHeight: 110,
                  height:
                    Object.keys(this.state.ingredients).length * 35 < 105
                      ? Object.keys(this.state.ingredients).length * 35
                      : 105,
                }}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.ingredientScroll}>
                  <>
                    {Object.keys(this.state.ingredients).length === 0 && (
                      <Text style={styles.ingredientText}>
                        No Ingredients Selected
                      </Text>
                    )}
                    {Object.keys(this.state.ingredients).map(key => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => {
                          this.handleIgnoreIngredient(key);
                        }}>
                        <View style={styles.ingredientContainer}>
                          <Text style={styles.ingredientText}>
                            {key + ':  '}
                          </Text>
                          <Text style={styles.ingredientText}>
                            {this.state.ingredients[key] * shotSize + ' fl oz'}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </>
                </ScrollView>
              </View>

              <Button
                buttonStyle={styles.lightButtonStyle}
                title="Edit Ingredients"
                onPress={() => {
                  this.setState({
                    editIngredients: true,
                  });
                }}
              />

              <Button
                buttonStyle={styles.saveButtonStyle}
                title="Save Recipe"
                onPress={() => {
                  this.saveRecipe();
                }}
              />
            </>
          )}

          {this.state.editIngredients && (
            <EditIngredientsComponent
              recipeIngredients={Object.keys(this.state.ingredients)}
              recipeAmounts={Object.keys(this.state.ingredients).map(key =>
                (this.state.ingredients[key] * shotSize).toString(),
              )}
              saveRecipe={this.saveIngredients.bind(this)}
            />
          )}
        </>
      </Overlay>
    );
  }
}

export default EditRecipeOverlay;

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
  textStyle: {
    fontSize: 20,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  imageStyle: {
    width: imageSize,
    height: imageSize,
    borderRadius: 20,
    alignSelf: 'center',
  },
  topSection: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    maxHeight: imageSize + 15,
    textAlign: 'center',
  },

  topEditContainer: {
    flexDirection: 'column',
    width: recipeOverlayWidth - imageSize - 20,
    height: imageSize,
  },

  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    marginTop: 15,
    marginLeft: 8,
  },

  ingredientScroll: {
    backgroundColor: 'darkgray',
    borderRadius: 5,
    marginHorizontal: 10,
  },

  ingredientText: {
    fontSize: 18,
    paddingBottom: 4,
  },

  ingredientContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 5,
  },

  ingredientOpacity: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  ingredientLabel: {
    textAlign: 'center',
    fontSize: 18,
    textDecorationLine: 'underline',
    marginBottom: 2,
  },

  lightButtonStyle: {
    borderRadius: 20,
    width: 175,
    backgroundColor: '#7295A6',
    alignSelf: 'center',
    marginTop: 10,
  },

  saveButtonStyle: {
    backgroundColor: '#3E525C',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 15,
  },
});
