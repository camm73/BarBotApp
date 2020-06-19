import React from 'react';
import {TouchableOpacity, Image, Alert, StyleSheet} from 'react-native';
import {uploadImage} from '../api/Cloud';
import ImagePicker from 'react-native-image-picker';
import {toUpper} from '../utils/Tools';

const imageOptions = {
  quality: 0.05,
};

//Requires props: (name, imageSrc)
class CocktailThumbnailButton extends React.Component {
  state = {};

  componentDidMount() {}

  render() {
    return (
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
              console.log('Successfully selected image. Will upload now...');
              uploadImage(
                this.props.name,
                source,
                this.imageUploadCallback.bind(this),
              );
            }
          });
        }}>
        <Image style={styles.largeImage} source={this.props.imageSrc} />
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
