/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, ScrollView, StyleSheet, Text, Dimensions} from 'react-native';
import {toUpper} from '../utils/Tools';
import IngredientItem from '../components/IngredientItem';
import {Button} from 'react-native-elements';
import {getAllBottles} from '../api/Control';

var screenWidth = Dimensions.get('window').width;
//var screenHeight = Dimensions.get('window').height;
const recipeOverlayWidth = screenWidth / 1.2;
//const recipeOverlayHeight = screenHeight/1.2;

class EditIngredientsComponent extends React.Component {
  state = {
    ingredientCount: this.props.recipeIngredients.length,
    recipeIngredients: this.props.recipeIngredients,
    recipeAmounts: this.props.recipeAmounts,
    fullBottleList: [],
  };

  componentDidMount() {
    this.loadBottleList();
  }

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

  loadBottleList() {
    getAllBottles().then(response => {
      var fullList = [];
      //console.log(response);
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

  render() {
    return (
      <View>
        <Text style={styles.subtext}>Ingredients</Text>
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
            paddingBottom: 5,
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
                  <Text style={styles.ingredientText}>
                    {toUpper(amount) + '  fl oz'}
                  </Text>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>

        <IngredientItem
          bottleItems={this.state.fullBottleList}
          overlayWidth={recipeOverlayWidth}
          ingredCallback={this.setIngredValue.bind(this)}
          amountCallback={this.setAmountValue.bind(this)}
        />

        <Button
          title="Save Recipe"
          buttonStyle={styles.buttonStyle}
          onPress={() => {
            this.props.saveRecipe(
              this.state.recipeIngredients,
              this.state.recipeAmounts,
            );
          }}
        />
      </View>
    );
  }
}

export default EditIngredientsComponent;

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'column',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    maxHeight: 50,
  },
  subtext: {
    fontSize: 18,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingBottom: 5,
  },
  ingredientText: {
    fontSize: 16,
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#3E525C',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 15,
  },
});
