/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import {Overlay, Icon} from 'react-native-elements';
import Spacer from '../components/Spacer';
import CocktailThumbnailButton from '../components/CocktailThumbnailButton';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

const recipeOverlayWidth = screenWidth / 1.2;
const recipeOverlayHeight = 570;

class EditRecipeOverlay extends React.Component {
  state = {
    recipeName: this.props.cocktailName,
  };

  render() {
    return (
      <Overlay
        width={recipeOverlayWidth}
        height={recipeOverlayHeight}
        visible={this.props.visible}
        overlayStyle={styles.overlay}>
        <View style={styles.backButtonRow}>
          <TouchableOpacity
            onPress={() => {
              //TODO: Reset the component and use callback to close overlay
              this.props.closeCallback();
            }}>
            <Icon name="back" size={33} type="antdesign" />
          </TouchableOpacity>
        </View>

        <Text style={styles.textStyle}>Edit Recipe</Text>

        <CocktailThumbnailButton name={this.state.recipeName} />
        <Text style={{fontSize: 18, marginTop: 10, textAlign: 'center'}}>
          Cocktail Name: {this.state.recipeName}{' '}
        </Text>
        <Spacer height={15} />
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
  textStyle: {
    fontSize: 20,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
