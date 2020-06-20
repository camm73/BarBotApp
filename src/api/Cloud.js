var AWS = require('aws-sdk');
var awsCreds = require('../config/awsCreds.json');
var s3 = new AWS.S3({
  accessKeyId: awsCreds.accessKeyId,
  secretAccessKey: awsCreds.secretAccessKey,
  region: awsCreds.region,
});
var dynamodb = new AWS.DynamoDB({
  accessKeyId: awsCreds.accessKeyId,
  secretAccessKey: awsCreds.secretAccessKey,
  region: awsCreds.region,
});
import {toUpper} from '../utils/Tools';
import {Alert} from 'react-native';

export function getThumbnail(cocktailName) {
  console.log('GETTING THUMBNAIL for ' + cocktailName);
  var params = {
    Bucket: 'barbot-data',
    Key: toUpper(cocktailName) + '.jpg',
    Expires: 86400,
  };
  var url = s3.getSignedUrl('getObject', params);
  //console.log(url);
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

//Load set of cocktail names from Dynamodb
export function loadCocktailNames(number, lastKey) {
  //Add ability to consider lastKey
  var params = {
    TableName: 'BarBot-Recipe',
    ExpressionAttributeNames: {
      '#c': 'cocktailName',
    },
    ProjectionExpression: '#c',
    Limit: number,
    ExclusiveStartKey:
      Object.keys(lastKey).length === 0 && lastKey.constructor === Object
        ? undefined
        : lastKey,
  };

  return new Promise(function(resolve, reject) {
    dynamodb.scan(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject('Failed to retreived cocktail names. ' + err);
      } else {
        console.log(data);
        resolve(data);
      }
    });
  });
}

//Delete recipe from dynamo table
export function deleteRecipe(recipeName) {
  var params = {
    Key: {
      cocktailName: {
        S: recipeName,
      },
    },
    TableName: 'BarBot-Recipe',
  };

  return new Promise(function(resolve, reject) {
    dynamodb.deleteItem(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(false);
      } else {
        console.log(data);
        resolve(true);
      }
    });
  });
}
