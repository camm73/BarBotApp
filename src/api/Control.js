import React from 'react';
import {Alert} from 'react-native';

const barbotAddress = 'http://barbot.local:5000/';
const shotSize = 1.5;

export async function makeCocktail(name){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'cocktail/' + encodeURI(name.toLowerCase()) + '/', {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            resolve('DONE');
        }).catch((error) => {
            console.log(error);
            reject('ERROR');
        });
    });
}

export async function removeBottle(number, bottleName){
    await reverse();
    pumpOn(number);
    setTimeout(async () => {
        pumpOff(number)
        await reverse();
    }, 15000);

    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'removeBottle/' + bottleName, {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log('Removed bottle: ' + bottleName + "; " + responseJson);
            resolve('true')
        }).catch((error) => {
            console.log('Issue removing bottle!');
            console.log(error);
            reject('false')
        });
    });
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

        if(bottleName === 'N/A'){
            reject('Cannot run request for unknown bottle')
        }

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

        if(bottleName === 'N/A'){
            reject('Cannot run request for unknown bottle')
        }

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
    fetch(barbotAddress + 'clean/', {
        method: 'GET'
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
            console.log('Returned error: ' + error);
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
            console.log('Returned error: ' + error);
            reject('ERROR');
        });
    });
}

export async function getBottlePercent(bottleNum){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + 'bottlePercent/' + bottleNum + "/", {
            method: 'GET'
        }).then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            resolve(responseJson);
        }).catch((error) => {
            console.log('Returned error: ' + error);
            reject('ERROR');
        });
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