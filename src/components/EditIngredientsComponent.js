/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {toUpper} from '../utils/Tools';
import IngredientItem from '../components/IngredientItem';
import {Button} from 'react-native-elements';
import {getAllBottles} from '../api/Control';
import Spacer from '../components/Spacer';

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
    editIngredient: '',
    editAmount: '',
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
      for (var i = 0; i < response.length; i++) {
        if (this.props.recipeIngredients.includes(response[i])) {
          //console.log('Skipping: ' + response[i]);
          continue;
        }
        fullList.push({
          id: i,
          name: response[i],
          value: response[i],
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
            maxHeight: 90,
            height:
              this.state.ingredientCount * 35 < 82
                ? this.state.ingredientCount * 35
                : 82,
            paddingBottom: 5,
          }}>
          <ScrollView
            bounces={true}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              maxWidth: recipeOverlayWidth - 20,
              width: recipeOverlayWidth - 20,
              backgroundColor: 'gray',
              borderRadius: 10,
              borderColor: 'black',
              borderWidth: 1,
            }}>
            <View style={{flexDirection: 'column', alignItems: 'center'}}>
              {this.state.recipeIngredients.map((ingredient, index) => (
                <TouchableOpacity
                  onPress={() => {
                    var oldIngreds = this.state.recipeIngredients;
                    oldIngreds.splice(index, 1);

                    var editAmt = this.state.recipeAmounts[index];
                    var oldAmts = this.state.recipeAmounts;
                    oldAmts.splice(index, 1);

                    var newIngredCount = this.state.ingredientCount - 1;
                    this.setState({
                      editIngredient: ingredient,
                      editAmount: editAmt,
                      recipeIngredients: oldIngreds,
                      recipeAmounts: oldAmts,
                      ingredientCount: newIngredCount,
                    });
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Text style={styles.ingredientText}>
                      {toUpper(ingredient)}
                    </Text>
                    <Spacer width={35} />
                    <Text style={styles.ingredientText}>
                      {toUpper(this.state.recipeAmounts[index]) + '  fl oz'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <IngredientItem
          bottleItems={this.state.fullBottleList}
          overlayWidth={recipeOverlayWidth}
          ingredCallback={this.setIngredValue.bind(this)}
          amountCallback={this.setAmountValue.bind(this)}
          selectedItem={this.state.editIngredient}
          selectedAmount={this.state.editAmount}
          clearInitialItems={() => {
            this.setState({
              editAmount: '',
              editIngredient: '',
            });
          }}
        />

        <Button
          title="Save Ingredient Changes"
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
    maxHeight: 60,
  },
  subtext: {
    fontSize: 18,
    textDecorationLine: 'underline',
    textAlign: 'center',
    paddingBottom: 5,
  },
  ingredientText: {
    fontSize: 19,
    textAlign: 'center',
    paddingBottom: 2,
  },
  buttonStyle: {
    backgroundColor: '#3E525C',
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 15,
  },
});
