import React from 'react';
import {Alert} from 'react-native';
import AbortController from 'abort-controller';

//const thumbnailApi = require('../config/thumbnailApi.json');

const barbotAddress = 'http://barbot.local:5000/';
const shotSize = 1.5;

export async function makeCocktail(name) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 60000);

  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'cocktail/' + encodeURI(name.toLowerCase()) + '/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.text())
      .then(responseText => {
        console.log('Cocktail Response: ' + responseText);
        if (responseText === 'available') {
          Alert.alert("We're sorry, but this cocktail is no longer available.");
        } else if (responseText === 'busy') {
          Alert.alert('BarBot is busy right now! Try again in a little while.');
        } else if (responseText === 'ingredients') {
          Alert.alert(
            'BarBot does not have the necessary ingredients for this cocktail. Sorry!',
          );
        } else if (responseText === 'error') {
          Alert.alert(
            'An unexpected error occurred while BarBot was making your cocktail!',
          );
        }
        resolve('DONE');
      })
      .catch(error => {
        Alert.alert('An error occurred trying to make this cocktail!');
        console.log(error);
        reject('ERROR');
      });
  });
}

//Remove bottles from every pump
export async function removeAllBottles() {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 30000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'removeAllBottles/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.text())
      .then(responseText => {
        if (responseText === 'true') {
          console.log('Successfully removed all bottles!');
        } else if (responseText === 'busy') {
          console.log('Barbot is busy!');
        } else if (responseText === 'error') {
          console.log('Error removing all bottles');
        } else {
          console.log('Failed to remove all bottles');
        }

        resolve(responseText);
      })
      .catch(error => {
        console.log('Issue removing all bottles!');
        console.log(error);
        reject('false');
      });
  });
}

//TODO: Migrate reverse and pumpOn call to the removeBottle function on server-side
export async function removeBottle(number, bottleName) {
  var result = '';
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 30000);

  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'removeBottle/' + bottleName, {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.text())
      .then(responseJson => {
        console.log('Removed bottle: ' + bottleName + '; ' + responseJson);
        result = responseJson;
        resolve(responseJson);
      })
      .catch(error => {
        console.log('Issue removing bottle!');
        console.log(error);
        reject(result); //TODO: May need to check what this is expecting to return
      });
  });
}

//Check whether alcoholMode is enabled or not
export async function checkAlcoholMode() {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);

  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'getAlcoholMode/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('Alcohol Mode: ' + responseJson);
        resolve(responseJson);
      })
      .catch(error => {
        console.log('Error loading Alcohol mode!');
      });
  });
}

export async function setAlcoholMode(modeSetting) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'alcoholMode/', {
      method: 'POST',
      signal: abortController.signal,
      body: JSON.stringify({
        enable: modeSetting,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        resolve(responseJson);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

export async function addBottle(bottleName, pumpNum, volume, originalVolume) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  return new Promise(function(resolve, reject) {
    fetch(
      barbotAddress +
        'addBottle/' +
        bottleName +
        '/pump/' +
        pumpNum.toString() +
        '/volume/' +
        volume +
        '/originalVolume/' +
        originalVolume +
        '/',
      {
        method: 'GET',
        signal: abortController.signal,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject('false');
        console.log(error);
      });
  });
}

//Add cocktail recipe to menu hosted on BarBot
export async function addRecipe(recipeName, ingredients, amounts) {
  //Need to process amounts for BarBot's format
  for (var i = 0; i < amounts.length; i++) {
    var oldAmount = amounts[i];
    amounts[i] = parseFloat(oldAmount.replace(/.oz/g, '')) / shotSize;
  }

  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);

  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'addRecipe/', {
      method: 'POST',
      signal: abortController.signal,
      body: JSON.stringify({
        name: recipeName,
        ingredients: ingredients,
        amounts: amounts,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.status === 200) {
          console.log('Successfully added new recipe: ' + recipeName);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(error => {
        reject(false);
        console.log(error);
      });
  });
}

export async function getNewBottles() {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 30000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'getBottles/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject([]);
        console.log(error);
      });
  });
}

export async function getAllBottles() {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 30000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'getAllBottles/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        reject([]);
        console.log(error);
      });
  });
}

export async function addNewBottle(bottleName, isAlcohol) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'newBottle/' + bottleName + '/alcohol=' + isAlcohol, {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        console.log(error);
        reject(false);
      });
  });
}

export async function reverse() {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 10000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'reverse/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.text())
      .then(responseText => {
        console.log('Reversed polarity: ' + responseText);
        resolve(responseText);
      })
      .catch(error => {
        console.log('Error reversing polarity');
        reject(error);
      });
  });
}

export async function pumpOn(number) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  fetch(barbotAddress + 'pumpOn/' + number.toString() + '/', {
    method: 'GET',
    signal: abortController.signal,
  })
    .then(response => response.text())
    .then(responseText => {
      console.log('Pump on: ' + responseText);
    })
    .catch(error => {
      console.log(error);
    });
}

export async function calibratePump(number, time) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  return new Promise(function(resolve, reject) {
    fetch(
      barbotAddress +
        'calibrate/' +
        number.toString() +
        '/time/' +
        time.replace('.', '%2E'),
      {
        method: 'GET',
        signal: abortController.signal,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        resolve(responseJson);
      })
      .catch(error => {
        console.log(error);
        reject(false);
      });
  });
}

export async function getPumpSupportDetails() {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'pumpSupportDetails/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('Retreieved pump support data');
        console.log(responseJson);
        resolve(responseJson);
      })
      .catch(error => {
        console.log(error);
        reject([]);
      });
  });
}

export async function getCurrentBottleVolume(bottleName) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'volume/' + bottleName + '/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.text())
      .then(responseText => {
        //console.log('Current Volume of ' + bottleName + ' is: ' + responseText);
        resolve(responseText);
      })
      .catch(error => {
        console.log(error);
        reject('There was an error getting current bottle volume: ' + error);
      });
  });
}

export async function getInitBottleVolume(bottleName) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'initVolume/' + bottleName + '/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.text())
      .then(responseText => {
        //console.log('Initial Volume of ' + bottleName + ' is: ' + responseText);
        resolve(responseText);
      })
      .catch(error => {
        console.log(error);
        reject('There was an error getting initial bottle volume: ' + error);
      });
  });
}

export async function pumpOff(number) {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 15000);
  fetch(barbotAddress + 'pumpOff/' + number.toString() + '/', {
    method: 'GET',
    signal: abortController.signal,
  })
    .then(response => response.text())
    .then(responseText => {
      console.log('Pump off: ' + responseText);
    })
    .catch(error => {
      console.log(error);
    });
}

export async function isOnline() {
  const abortController = new AbortController();
  setTimeout(() => {
    abortController.abort();
  }, 5000);
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'heartbeat/', {
      method: 'GET',
      signal: abortController.signal,
    })
      .then(response => response.text())
      .then(text => {
        console.log('Heartbeat: ' + text);
        resolve(text);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

export async function cleanPumps() {
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'clean/', {
      method: 'GET',
    })
      .then(response => response.text())
      .then(responseText => {
        console.log('Pumping cleaning response: ');
        console.log(responseText);
        if (responseText === 'busy') {
          Alert.alert('BarBot is busy right now! Try again soon.');
        }
        resolve(responseText);
      })
      .catch(error => {
        console.log('Error cleaning pumps: ' + error);
        reject('false');
      });
  });
}

export async function getCocktailMenu() {
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'cocktailList/', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        console.log('getCocktailMenu error: ' + error);
        reject('ERROR');
      });
  });
}

export async function getIngredients(name) {
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'ingredients/' + name.toLowerCase() + '/', {
      method: 'GET',
    })
      .then(response => response.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        console.log('getIngredients error: ' + error);
        reject('ERROR');
      });
  });
}

export async function getBottlePercent(bottleName) {
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'bottlePercent/' + bottleName + '/', {
      method: 'GET',
    })
      .then(response => response.text())
      .then(responseJson => {
        //console.log(responseJson);
        resolve(responseJson);
      })
      .catch(error => {
        console.log('getBottlePercent error: ' + error);
        reject('ERROR');
      });
  });
}

export async function getBottleName(number) {
  var address = barbotAddress + 'bottleName/' + number + '/';
  return new Promise(function(resolve, reject) {
    fetch(address, {
      method: 'GET',
    })
      .then(response => response.text())
      .then(responseText => {
        //console.log('Bottle Name Response: ' + responseText);
        resolve(responseText);
      })
      .catch(error => {
        console.log(error);
        reject(error);
      });
  });
}

//Refreshes local recipes on the pi by fetching from dynamo
export async function refreshRecipes() {
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'refreshRecipes/', {
      method: 'GET',
    })
      .then(response => response.text())
      .then(resText => {
        resolve(resText);
      })
      .catch(error => {
        console.log(error);
        reject('Error refreshing cocktail recipes');
      });
  });
}

//Gets ingredients that should be ignored
export async function getIgnoreIngredients() {
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'getIgnoreIngredients/', {
      method: 'GET',
    })
      .then(res => res.json())
      .then(responseJson => {
        resolve(responseJson);
      })
      .catch(error => {
        console.log(error);
        reject('There was an error getting ignored ingredients list');
      });
  });
}

//Updates ignore ingredients
export async function updateIgnoreIngredients(ingredient, add) {
  return new Promise(function(resolve, reject) {
    fetch(barbotAddress + 'ignoreIngredient/', {
      method: 'POST',
      body: JSON.stringify({
        action: add === true ? 'add' : 'remove',
        ingredient: ingredient,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.text())
      .then(responseText => {
        if (responseText === 'true') {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(err => {
        console.log(err);
        reject('Error setting ignore ingredient!');
      });
  });
}
