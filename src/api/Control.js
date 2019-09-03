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