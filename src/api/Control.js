import React from 'react';
import {Alert} from 'react-native';
const thumbnailApi = require('../config/thumbnailApi.json');

const barbotAddress = 'http://barbot.local:5000/';
const shotSize = 1.5;

export async function makeCocktail(name){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'cocktail/' + encodeURI(name.toLowerCase()) + '/', {
            method: 'GET'
        }).then((response) => response.text())
        .then((responseText) => {
            console.log('Cocktail Response: ' + responseText);
            if(responseText === 'available'){
                Alert.alert("We're sorry, but this cocktail is no longer available.");
            }else if(responseText === 'busy'){
                Alert.alert('BarBot is busy right now! Try again in a little while.');
            }else if(responseText === 'ingredients'){
                Alert.alert('BarBot does not have the necessary ingredients for this cocktail. Sorry!');
            }
            resolve('DONE');
        }).catch((error) => {
            Alert.alert('An error occurred trying to make this cocktail!');
            console.log(error);
            reject('ERROR');
        });
    });
}

//Remove bottles from every pump
export async function removeAllBottles(){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'removeAllBottles/', {
            method: 'GET'
        }).then((response) => response.text())
        .then((responseText) => {
            if(responseText == 'true'){
                console.log('Successfully removed all bottles!');
                resolve(responseText);
            }else{
                console.log("Failed to remove all bottles");
                resolve(responseText);
            }
        }).catch((error) => {
            console.log('Issue removing all bottles!');
            console.log(error);
            reject('false');
        });
    });
}

//TODO: Migrate reverse and pumpOn call to the removeBottle function on server-side
export async function removeBottle(number, bottleName){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'removeBottle/' + bottleName, {
            method: 'GET'
        }).then((response) => response.text())
        .then((responseJson) => {
            console.log('Removed bottle: ' + bottleName + "; " + responseJson);
            resolve(responseJson);
        }).catch((error) => {
            console.log('Issue removing bottle!');
            console.log(error);
            reject(responseJson);
        });
    });
}

//Check whether alcoholMode is enabled or not
export async function checkAlcoholMode(){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + "getAlcoholMode/", {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log("Alcohol Mode: " + responseJson);
            resolve(responseJson);
        }).catch((error) => {
            console.log('Error loading Alcohol mode!');
        });
    })
}


export async function setAlcoholMode(modeSetting){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + "alcoholMode/", {
            method: 'POST',
            body: JSON.stringify({
                enable: modeSetting
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            resolve(responseJson);
        }).catch((error) => {
            console.log(error);
            reject(error)
        })
    })
}


export async function addBottle(bottleName, pumpNum, volume, originalVolume){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'addBottle/' + bottleName + '/pump/' + pumpNum.toString() + '/volume/' + volume + '/originalVolume/' + originalVolume + '/', 
        {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        }).catch((error) => {
            reject('false');
            console.log(error);
        })
    })
}

//Add cocktail recipe to menu hosted on BarBot
export async function addRecipe(recipeName, ingredients, amounts){

    //Need to process amounts for BarBot's format
    for(var i = 0; i < amounts.length; i++){
        var oldAmount = amounts[i]
        amounts[i] = parseFloat(oldAmount.replace(/.oz/g, ''))/shotSize
    }


    return new Promise(function(resolve, reject) {
        fetch(barbotAddress + 'addRecipe/', {
            method: 'POST',
            body: JSON.stringify({
                name: recipeName,
                ingredients: ingredients,
                amounts: amounts
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((responseJson) => {
            resolve(responseJson);
            console.log("Successfully added new recipe: " + recipeName);
        }).catch((error) => {
            reject('false');
            console.log(error);
        });
    });
}

export async function getNewBottles(){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'getBottles/', {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        }).catch((error) => {
            reject([]);
            console.log(error);
        });
    });
}

export async function getAllBottles(){
    return new Promise(function(resolve, reject) {
        fetch(barbotAddress + 'getAllBottles/', {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        }).catch((error) => {
            reject([]);
            console.log(error);
        })
    })
}

export async function addNewBottle(bottleName){
    fetch(barbotAddress + 'newBottle/' + bottleName + '/', {
        method: 'GET'
    }).then((response) => response.json())
    .then((responseJson) => {
        resolve(responseJson);
    }).catch((error) => {
        console.log(error)
        reject(false)
    });
}


export async function reverse(){
    return new Promise(function(resolve, reject) {
        fetch(barbotAddress + 'reverse/', {
        method: 'GET'
        }).then((response) => response.text())
        .then((responseText) => {
            console.log('Reversed polarity: ' + responseText);
            resolve(responseText);
        }).catch((error) => {
            console.log('Error reversing polarity');
            reject(error);
        });
    });
}

export async function pumpOn(number){
    fetch(barbotAddress + 'pumpOn/' + number.toString() + "/", {
        method: 'GET'
    }).then((response) => response.text())
    .then((responseText) => {
        console.log('Pump on: ' + responseText);
    }).catch((error) => {
        console.log(error);
    });
}

export async function calibratePump(number, time){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + "calibrate/" + number.toString() + '/time/' + time.replace('.', '%2E'), {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        }).catch((error) => {
            console.log(error);
            reject(false);
        });
    })
}

export async function getCurrentBottleVolume(bottleName){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'volume/' + bottleName + '/', {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseText) => {
            console.log('Current Volume of ' + bottleName + " is: " + responseText);
            resolve(responseText);
        }).catch((error) => {
            console.log(error);
            reject('There was an error getting current bottle volume: ' + error);
        });
    });
}


export async function getInitBottleVolume(bottleName){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'initVolume/' + bottleName + '/', {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseText) => {
            console.log('Initial Volume of ' + bottleName + " is: " + responseText);
            resolve(responseText);
        }).catch((error) => {
            console.log(error);
            reject('There was an error getting initial bottle volume: ' + error);
        });
    });
}


export async function pumpOff(number){
    fetch(barbotAddress + 'pumpOff/' + number.toString() + "/", {
        method: 'GET'
    }).then((response) => response.text())
    .then((responseText) => {
        console.log('Pump off: ' + responseText);
    }).catch((error) => {
        console.log(error);
    });
}

export async function isOnline(){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'heartbeat/', {
            method: 'GET'
        }).then((response) => response.text())
        .then((text) => {
            console.log('Heartbeat: ' + text);
            resolve(text);
        }).catch((error) => {
            console.log(error);
            reject(error);
        })
    })
}

export async function cleanPumps(){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'clean/', {
            method: 'GET'
        }).then((response) => response.text())
        .then((responseText) => {
            console.log('Pumping cleaning response: ');
            console.log(responseText);
            if(responseText === 'busy'){
                Alert.alert("BarBot is busy right now! Try again soon.");
            }
            resolve(responseText);
        }).catch((error) => {
            console.log('Error cleaning pumps: ' + error);
            reject('false');
        })
    });
}

export async function getCocktailMenu(){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'cocktailList/', {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        }).catch((error) => {
            console.log('getCocktailMenu error: ' + error);
            reject('ERROR');
        });
    });

}

export async function getIngredients(name){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'ingredients/' + name.toLowerCase() + '/', {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            resolve(responseJson);
        }).catch((error) => {
            console.log('getIngredients error: ' + error);
            reject('ERROR');
        });
    });
}

export async function getBottlePercent(bottleNum){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'bottlePercent/' + bottleNum + "/", {
            method: 'GET'
        }).then((response) => response.text())
        .then((responseJson) => {
            //console.log(responseJson);
            resolve(responseJson);
        }).catch((error) => {
            console.log('getBottlePercent error: ' + error);
            reject('ERROR');
        });
    });
}

export async function uploadImage(cocktailName){
    console.log("Thumbnail: " + cocktailName);
    var address = thumbnailApi['apiAddress'] + cocktailName + '/';
    return new Promise(function(resolve, reject){
        fetch(address, {
            method: 'GET'
        }).then((response) => response.text())
        .then((responseText) => {
            resolve('true');
        })
    }); 
}

export async function getBottleName(number){
    var address = barbotAddress + 'bottleName/' + number + '/';
    return new Promise(function(resolve, reject){
        fetch(address, {
            method: 'GET'
        }).then((response) => response.text())
        .then((responseText) => {
            //console.log(responseText);
            resolve(responseText)
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}