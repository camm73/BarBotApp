/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {Button} from 'react-native-elements';
import {pumpOn, pumpOff, calibratePump} from '../api/Control';
import Spacer from './Spacer';

export const calibrationSlideCount = 2;
const calibrationVolume = 44.3; //mL
const shotVolume = 44.3; //mL

var startTime = null;
var endTime = null;

class CalibrationBody extends React.Component {
  state = {
    calRunning: false,
  };

  componentDidMount() {
    //console.log(this.props.slide);
    //console.log(this.props.pumpNum);
  }

  render() {
    return (
      <View>
        {(this.props.slide === 1 && (
          <View>
            <Text style={styles.textStyle}>
              Before beginning calibration, place the pump input tube in a large
              cup of water.
            </Text>
            <Spacer height={10} />
            <Text style={styles.textStyle}>
              Next, prime the pump by holding this button below until the liquid
              reaches the end of the output tube. Place a 1.5 fl oz jigger or
              shot glass at the output.
            </Text>
            <View style={styles.calibrateButtons}>
              <Button
                title="Prime Bottle"
                buttonStyle={styles.buttonStyle}
                onPressIn={() => {
                  pumpOn(this.props.pumpNum);
                }}
                onPressOut={() => {
                  pumpOff(this.props.pumpNum);
                }}
              />
            </View>
          </View>
        )) ||
          (this.props.slide === 2 && (
            <View>
              <Text style={styles.textStyle}>
                Press the Start Button to begin calibration.
              </Text>
              <View style={styles.calibrateButtons}>
                <Button
                  title="Start"
                  disabled={this.state.calRunning}
                  buttonStyle={{
                    borderRadius: 20,
                    width: 175,
                    backgroundColor: 'green',
                  }}
                  onPress={() => {
                    pumpOn(this.props.pumpNum);
                    startTime = new Date().getTime();
                    this.setState({
                      calRunning: true,
                    });
                  }}
                />
              </View>
              <Spacer height={10} />
              <Text style={styles.textStyle}>
                Immediately after the water stops coming out of the output tube,
                press the Stop Button.
              </Text>
              <View style={styles.calibrateButtons}>
                <Button
                  title="Stop"
                  disabled={!this.state.calRunning}
                  buttonStyle={{
                    borderRadius: 20,
                    width: 175,
                    backgroundColor: 'red',
                  }}
                  onPress={async () => {
                    endTime = new Date().getTime();
                    pumpOff(this.props.pumpNum);

                    this.setState({
                      calRunning: false,
                    });

                    var shotTime = (endTime - startTime) / 1000.0;
                    //console.log('Shot time: ' + shotTime.toString());
                    calibratePump(this.props.pumpNum, shotTime.toString()).then(
                      response => {
                        //console.log(response);
                        if (response === true) {
                          Alert.alert(
                            'The calibration has finished with shotTime: ' +
                              shotTime.toString() +
                              '. Press the done button to continue',
                          );
                        } else {
                          Alert.alert(
                            'There was an error calibrating the pump. Try rebooting the BarBot. Press the Done Button to continue.',
                          );
                        }
                      },
                    );
                  }}
                />
              </View>
            </View>
          ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  controlContainer: {
    alignItems: 'center',
  },

  buttonStyle: {
    borderRadius: 20,
    width: 175,
    backgroundColor: '#7295A6',
  },

  textStyle: {
    textAlign: 'center',
    fontSize: 18,
  },

  calibrateButtons: {
    alignSelf: 'center',
    paddingTop: 10,
  },
});

export default CalibrationBody;
