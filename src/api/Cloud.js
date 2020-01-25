var AWS = require('aws-sdk');
var awsCreds = require('../config/awsCreds.json');
var s3 = new AWS.S3({accessKeyId: awsCreds['accessKeyId'], secretAccessKey: awsCreds['secretAccessKey'], region: awsCreds['region']});
import {toUpper} from '../utils/Tools';


export function getThumbnail(cocktailName){
    var params = {Bucket: 'barbot-data', Key: toUpper(cocktailName) + '.jpg', Expires: 86400};
    var thumbPromise = s3.getSignedUrlPromise('getObject', params);
    var url = s3.getSignedUrl('getObject', params);
    return url;
}
