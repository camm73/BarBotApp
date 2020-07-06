/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import Spacer from './Spacer';
import {makeCocktail} from '../api/Control.js';
import {toUpper} from '../utils/Tools';
import {verifyImageExists, getThumbnail, getIngredients} from '../api/Cloud';
import EditRecipeOverlay from './EditRecipeOverlay';
import CocktailThumbnailButton from './CocktailThumbnailButton';
import LoadingComponent from './LoadingComponent';

const defaultImage = require('../assets/defaultCocktail.jpg');

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

var containerHeight = 130;

const shotSize = 1.5; //fl oz

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _isMounted = false;

  state = {
    ingredients: {},
    imageExists: false,
    thumbnailLink: '',
    editVisible: false,
    infoVisible: false,
    isMaking: false,
  };

  componentDidMount() {
    this._isMounted = true;
    getIngredients(this.props.name)
      .then(response => {
        if (this._isMounted) {
          this.setState({
            ingredients: response,
          });
        }
      })
      .catch(error => console.log(error));
    verifyImageExists(this.props.name, this.setImageExists.bind(this));
  }

  setImageExists(status) {
    //Load thumbnail
    if (status === true) {
      var link = getThumbnail(this.props.name);
      if (this._isMounted) {
        this.setState({
          thumbnailLink: link,
          imageExists: true,
        });
      }
    } else {
      if (this._isMounted) {
        this.setState({
          imageExists: status,
        });
      }
    }
  }

  imageUploadCallback() {
    if (this._isMounted) {
      this.setState({
        infoVisible: false,
      });
    }
    this.props.reloadCallback();
  }

  //Make sure updates don't occur after unmounting
  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <LoadingComponent
          title="Making Cocktail"
          message="Please wait while BarBot makes your cocktail."
          visible={this.state.isMaking}
        />
        <View style={styles.imageContainer}>
          <CocktailThumbnailButton
            imageStyle={styles.imageStyle}
            name={this.props.name}
            imageSrc={
              this.state.imageExists
                ? {uri: this.state.thumbnailLink}
                : defaultImage
            }
            onPress={() => {
              this.setState({
                infoVisible: true,
              });
            }}
          />
        </View>
        <View style={styles.infoStyle}>
          <TouchableOpacity
            style={styles.imageTouch}
            onPress={() => {
              this.setState({
                infoVisible: true,
              });
            }}>
            <Text style={styles.textStyle}>{this.props.name}</Text>
          </TouchableOpacity>

          <Spacer height={20} />
          {!this.props.editMode && (
            <Button
              title="Make Cocktail"
              buttonStyle={styles.buttonStyle}
              onPress={async () => {
                console.log('Making cocktail: ' + this.props.name);
                Alert.alert(
                  'Cocktail Confirmation',
                  'Are you sure you want to make a ' + this.props.name + '?',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => console.log('Canceled'),
                      style: 'cancel',
                    },
                    {
                      text: 'Make Cocktail',
                      onPress: () => {
                        this.setState({
                          isMaking: true,
                        });
                        makeCocktail(this.props.name)
                          .then(res => {
                            console.log('Toggling off');
                            this.setState({
                              isMaking: false,
                            });
                          })
                          .catch(err => {
                            console.log(err);
                            this.setState({
                              isMaking: false,
                            });
                          });
                      },
                    },
                  ],
                );
              }}
            />
          )}

          {this.props.editMode && (
            <Button
              title="Edit Cocktail"
              buttonStyle={styles.buttonStyle}
              onPress={() => {
                this.setState({
                  editVisible: true,
                });
              }}
            />
          )}

          {this.props.editMode && (
            <EditRecipeOverlay
              visible={this.state.editVisible}
              cocktailName={this.props.name}
              reloadCallback={this.props.reloadCallback}
              ignoreIngredients={this.props.ignoreIngredients}
              closeCallback={() => {
                this.setState({
                  editVisible: false,
                });
              }}
            />
          )}
        </View>

        <Overlay
          isVisible={this.state.infoVisible}
          width={screenWidth - 100}
          height={screenHeight / 1.6}
          overlayStyle={styles.overlayStyle}>
          <>
            <Text style={styles.headerText}>{this.props.name}</Text>

            <CocktailThumbnailButton
              name={this.props.name}
              imageSrc={
                this.state.imageExists
                  ? {uri: this.state.thumbnailLink}
                  : defaultImage
              }
              imageUploadCallback={this.imageUploadCallback.bind(this)}
              imageStyle={{
                width: screenHeight / 5,
                height: screenHeight / 5,
                borderRadius: 5,
                alignSelf: 'center',
              }}
            />

            <Spacer height={10} />
            <Text style={styles.textStyle}>Ingredients</Text>
            <ScrollView
              contentContainerStyle={{flex: 1, paddingTop: 10}}
              keyboardShouldPersistTaps="handled"
              scrollEnabled={
                Object.keys(this.state.ingredients).length > 3 ? true : false
              }>
              {Object.keys(this.state.ingredients).map(key => (
                <View key={key}>
                  <Text style={styles.ingredientText}>
                    {toUpper(key) +
                      ':  ' +
                      this.state.ingredients[key] * shotSize +
                      ' (fl oz)'}
                  </Text>
                  <Spacer height={10} />
                </View>
              ))}
            </ScrollView>

            <Button
              title="Done"
              buttonStyle={styles.doneButton}
              onPress={() => {
                this.setState({
                  infoVisible: false,
                });
              }}
            />
          </>
        </Overlay>
      </View>
    );
  }
}

export default MenuItem;

const styles = StyleSheet.create({
  containerStyle: {
    alignContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#3E525C', //465B66
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    width: screenWidth - 60,
    height: containerHeight,
  },

  infoStyle: {
    flex: 3,
    alignItems: 'center',
  },

  textStyle: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Courier New',
    textDecorationLine: 'underline',
  },

  ingredientText: {
    fontSize: 16,
  },

  headerText: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Courier New',
    textDecorationLine: 'underline',
    paddingBottom: 15,
  },

  imageContainer: {
    flex: 1,
    padding: 10,
    paddingLeft: 20,
  },

  imageStyle: {
    width: 90,
    height: 90,
    borderRadius: 20,
  },

  largeImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
    alignSelf: 'center',
  },

  imageTouch: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonStyle: {
    borderRadius: 20,
    width: 175,
    backgroundColor: '#7295A6',
  },

  doneButton: {
    borderRadius: 20,
    width: 175,
    backgroundColor: '#7295A6',
    marginBottom: 15,
    marginTop: 8,
  },

  overlayStyle: {
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
});
