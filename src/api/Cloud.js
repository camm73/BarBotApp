var AWS = require('aws-sdk');
var awsCreds = require('../config/awsCreds.json');
var s3 = new AWS.S3({
  accessKeyId: awsCreds.accessKeyId,
  secretAccessKey: awsCreds.secretAccessKey,
  region: awsCreds.region,
});
import {toUpper} from '../utils/Tools';
import React from 'react';
import {Alert} from 'react-native';

export function getThumbnail(cocktailName) {
  console.log('GETTING THUMBNAIL');
  var params = {
    Bucket: 'barbot-data',
    Key: toUpper(cocktailName) + '.jpg',
    Expires: 86400,
  };
  var thumbPromise = s3.getSignedUrlPromise('getObject', params);
  var url = s3.getSignedUrl('getObject', params);
  console.log(url);
  return url;
}

export function verifyImageExists(cocktailName, callback) {
  var params = {
    Bucket: 'barbot-data',
    Key: toUpper(cocktailName) + '.jpg',
  };

  s3.headObject(params, (err, metadata) => {
    if (err && err.code === 'NotFound') {
      callback(false);
    } else {
      callback(true);
    }
  });
}

export function uploadImage(name, imgSource, callback) {
  var params = {
    Bucket: 'barbot-data',
    Key: toUpper(name) + '.jpg',
    ContentType: 'image/jpeg',
  };

  s3.getSignedUrl('putObject', params, function(err, url) {
    if (err) {
      console.log(err);
      return;
    } else {
      console.log('Upload URL: ' + url);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('Image successfully uploaded to S3');
          Alert.alert('Upload Success', 'Successfully uploaded image!', [
            {
              text: 'OK',
              onPress: () => {
                callback();
              },
            },
          ]);
        } else {
          console.log('Error while uploading image to S3');
        }
      }
    };
    xhr.setRequestHeader('Content-Type', 'image/jpeg');
    xhr.send(imgSource);
  });
}
