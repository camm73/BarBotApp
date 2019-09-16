import React from 'react';
import {Alert} from 'react-native';

const barbotAddress = 'http://barbot:5000/';

export async function makeCocktail(name){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + encodeURI(name.toLowerCase()) + '/', {
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

export async function removeBottle(number){
    await reverse();
    pumpOn(number);
    setTimeout(async () => {
        pumpOff(number)
        await reverse();
    }, 20000);
}

//TODO: THIS FUNCTION NEEDS TESTING AND A STEP THROUGH GUIDE
export async function replaceBottle(number){
    //First you need to remove the bottle
    await removeBottle();

    //TODO: Need to await confirmation from the user maybe a confirmation alert
    pumpOn(number);
    setTimeout(async () => {
        pumpOff(number);
    }, 5000);
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

//TODO: need to create an endpoint for this on the BarBot hardware
export async function getCurrentBottleVolume(bottleName){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + '/volume/' + bottleName + '/', {
            method: 'GET'
        }).then((response) => response.text())
        .then((responseText) => {
            console.log('Current Volume of ' + bottleName + " is: " + responseText);
            resolve(responseText);
        }).catch((error) => {
            console.log(error);
            reject('There was an error getting current bottle volume: ' + error);
        });
    });
}

//TODO: need to create an endpoint for this on the BarBot hardware
export async function getInitBottleVolume(bottleName){
    return new Promise(function(resolve, reject){
        fetch(barbotAddress + '/initVolume/' + bottleName + '/', {
            method: 'GET'
        }).then((response) => response.text())
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