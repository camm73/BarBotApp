import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import Spacer from './Spacer';
import {makeCocktail, getIngredients} from '../api/Control.js';
import {toUpper} from '../utils/Tools';
import {verifyImageExists, uploadImage, getThumbnail} from '../api/Cloud';
import ImagePicker from 'react-native-image-picker';

const defaultImage = require('../assets/defaultCocktail.jpg');

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

var containerHeight = 130;

const shotSize = 1.5; //fl oz

var infoVisible = false;

const imageOptions = {
  quality: 0.05,
};

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    ingredients: {},
    imageExists: false,
    thumbnailLink: '',
  };

  componentDidMount() {
    getIngredients(this.props.name)
      .then(response => {
        this.setState({
          ingredients: response,
        });
      })
      .catch(error => console.log(error));
    verifyImageExists(this.props.name, this.setImageExists.bind(this));
  }

  setImageExists(status) {
    //Load thumbnail
    if (status === true) {
      var link = getThumbnail(this.props.name);
      this.setState({
        thumbnailLink: link,
        imageExists: true,
      });
    } else {
      this.setState({
        imageExists: status,
      });
    }
  }

  imageUploadCallback() {
    infoVisible = false;
    this.props.reloadCallback();
  }

  render() {
    return (
      <View style={styles.containerStyle}>
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.imageTouch}
            onPress={() => {
              infoVisible = true;
              this.forceUpdate();
            }}>
            <Image
              style={styles.imageStyle}
              source={
                this.state.imageExists
                  ? {uri: this.state.thumbnailLink}
                  : defaultImage
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoStyle}>
          <TouchableOpacity
            style={styles.imageTouch}
            onPress={() => {
              infoVisible = true;
              this.forceUpdate();
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
                        makeCocktail(this.props.name);
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
                //TODO: Some state change to open editting overlay
              }}
            />
          )}
        </View>

        <Overlay
          isVisible={infoVisible}
          width={screenWidth - 100}
          height={screenHeight / 1.6}
          overlayStyle={styles.overlayStyle}>
          <Text style={styles.headerText}>{this.props.name}</Text>
          <TouchableOpacity
            onPress={() => {
              ImagePicker.showImagePicker(imageOptions, response => {
                if (response.didCancel) {
                  console.log('User canceled image selection');
                } else if (response.error) {
                  console.log('Image Picker error: ' + response.error);
                  Alert.alert(
                    'There was an error trying to upload your image. Try again later!',
                  );
                } else {
                  const source = {
                    uri: response.uri,
                    type: 'image/jpeg',
                    name: toUpper(this.props.name) + '.jpg',
                  };
                  console.log(
                    'Successfully selected image. Will upload now...',
                  );
                  uploadImage(
                    this.props.name,
                    source,
                    this.imageUploadCallback.bind(this),
                  );
                }
              });
            }}>
            <Image
              style={styles.largeImage}
              source={
                this.state.imageExists
                  ? {uri: this.state.thumbnailLink}
                  : defaultImage
              }
            />
          </TouchableOpacity>
          {false && (
            <Image
              style={styles.largeImage}
              source={
                this.state.imageExists
                  ? {uri: this.state.thumbnailLink}
                  : defaultImage
              }
            />
          )}
          <Spacer height={10} />
          <Text style={styles.textStyle}>Ingredients</Text>

          {Object.keys(this.state.ingredients).map(key => (
            <View>
              <Text style={styles.ingredientText}>
                {toUpper(key) +
                  ':  ' +
                  this.state.ingredients[key] * shotSize +
                  ' (fl oz)'}
              </Text>
              <Spacer height={10} />
            </View>
          ))}
          <Button
            title="Done"
            buttonStyle={styles.buttonStyle}
            onPress={() => {
              infoVisible = false;
              this.forceUpdate();
            }}
          />
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

  overlayStyle: {
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: 'lightgray',
  },
});
