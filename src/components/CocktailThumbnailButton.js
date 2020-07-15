import React from 'react';
import {TouchableOpacity, Image, Alert, StyleSheet} from 'react-native';
import {uploadImage, verifyImageExists, getThumbnail} from '../api/Cloud';
import ImagePicker from 'react-native-image-picker';
import {toUpper} from '../utils/Tools';

const defaultImage = require('../assets/defaultCocktail.jpg');

const imageOptions = {
  quality: 0.05,
};

//Requires props: (name) optional: (requestImage, imageSrc, imageStyle)
class CocktailThumbnailButton extends React.Component {
  state = {
    thumbnailImage:
      this.props.imageSrc === undefined ? defaultImage : this.props.imageSrc,
  };

  componentDidMount() {
    if (this.props.requestImage) {
      //Load image and set thumbnailImage in state
      verifyImageExists(this.props.name, this.setThumbnailImage.bind(this));
    }
  }

  //Fetches and sets image from S3
  setThumbnailImage(status) {
    //Load thumbnail
    if (status === true) {
      var link = getThumbnail(this.props.name);
      this.setState({
        thumbnailImage: {uri: link},
      });
    }
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.onPress === undefined) {
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
                console.log('Successfully selected image. Will upload now...');
                uploadImage(
                  this.props.name,
                  source,
                  this.props.imageUploadCallback.bind(this),
                );
              }
            });
          } else {
            this.props.onPress();
          }
        }}>
        <Image
          style={
            this.props.imageStyle === undefined
              ? styles.largeImage
              : this.props.imageStyle
          }
          source={
            this.props.requestImage
              ? this.state.thumbnailImage
              : this.props.imageSrc
          }
        />
      </TouchableOpacity>
    );
  }
}

export default CocktailThumbnailButton;

const styles = StyleSheet.create({
  largeImage: {
    width: 150,
    height: 150,
    borderRadius: 5,
    alignSelf: 'center',
  },
});
