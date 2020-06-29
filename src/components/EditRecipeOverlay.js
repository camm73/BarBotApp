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
import {addRecipe, deleteRecipe} from '../api/Cloud';
import {getIngredients} from '../api/Control';
import EditIngredientsComponent from './EditIngredientsComponent';

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

  componentDidMount() {
    this.loadIngredients();
  }

  loadIngredients() {
    getIngredients(this.state.recipeName)
      .then(response => {
        this.setState({
          ingredients: response,
        });
      })
      .catch(error => console.log(error));
  }

  resetComponent() {
    this.loadIngredients();
    this.setState({
      changeMade: false,
    });
  }

  getIngredientAmounts() {
    var amounts = [];
    for (var key in Object.keys(this.state.ingredients)) {
      console.log(this.state.ingredients[key]);
      amounts.push(this.state.ingredients[key]);
    }

    return amounts;
  }

  //Callback for EditIngredients Component
  saveIngredients(recipeIngreds, recipeAmts) {
    if (recipeIngreds.length > 0 && recipeAmts.length > 0) {
      var newIngreds = {};

      //console.log(recipeIngreds);
      console.log(recipeAmts);
      for (var i = 0; i < recipeIngreds.length; i++) {
        newIngreds[recipeIngreds[i]] = parseFloat(recipeAmts[i] / shotSize);
      }

      this.setState({
        ingredients: newIngreds,
        editIngredients: false,
      });
    }
  }

  //Replaces old recipe in dynamodb
  updateRecipe() {
    addRecipe(
      this.props.cocktailName,
      Object.keys(this.state.ingredients),
      this.getIngredientAmounts(),
    ).then(res => {
      console.log('Add Recipe result: ' + res);
      if (res === true) {
        Alert.alert(
          'Success',
          'Successfully added ' + this.props.cocktailName + ' recipe!',
          [
            {
              text: 'OK',
              onPress: this.props.reloadCallback,
            },
          ],
        );
      } else {
        Alert.alert(
          'Failed to add ' +
            this.props.cocktailName +
            ' recipe! Try again later.',
        );
      }
    });
  }

  render() {
    return (
      <Overlay
        width={recipeOverlayWidth}
        height={recipeOverlayHeight}
        visible={this.props.visible}
        overlayStyle={styles.overlay}>
        <View style={styles.backButtonRow}>
          <TouchableOpacity
            onPress={
              () => {
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
                            this.updateRecipe();
                            /*
                            updateRecipe(
                              this.state.recipeName,
                              this.state.ingredients,
                            )
                              .then(res => {
                                if (res === true) {
                                  this.props.closeCallback();
                                  this.resetComponent();
                                  Alert.alert('Successfully updated recipe!');
                                } else {
                                  this.props.closeCallback();
                                  this.resetComponent();
                                }
                              })
                              .catch(err => {
                                console.log(err);
                                Alert.alert(
                                  'There was an error updating recipe!',
                                );
                              });
                              */
                          },
                        },
                      ],
                    );
                  } else {
                    this.props.closeCallback();
                    this.resetComponent();
                  }
                }
              }
              //TODO: Reset the component and use callback to close overlay
              //this.props.closeCallback();
            }>
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

            <ScrollView
              style={{minHeight: 110, maxHeight: 110}}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.ingredientScroll}>
              {Object.keys(this.state.ingredients).length === 0 && (
                <Text style={styles.ingredientText}>
                  No Ingredients Selected
                </Text>
              )}
              {Object.keys(this.state.ingredients).map(key => (
                <View style={styles.ingredientContainer}>
                  <Text style={styles.ingredientText}>{key + ':  '}</Text>
                  <Text style={styles.ingredientText}>
                    {this.state.ingredients[key] * shotSize + ' fl oz'}
                  </Text>
                </View>
              ))}
            </ScrollView>

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
                console.log(this.state.recipeName + ' will be saved');
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
