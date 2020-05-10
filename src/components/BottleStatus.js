import React from 'react';
import {View, Alert, TextInput, ImageBackground, Text, Dimensions, StyleSheet, AsyncStorage} from 'react-native';
import {Overlay, Icon, Button} from 'react-native-elements';
import Spacer from './Spacer';
import {getBottlePercent, getBottleName, removeBottle, addBottle ,getCurrentBottleVolume, getInitBottleVolume, pumpOn, pumpOff, getNewBottles} from '../api/Control';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {toUpper} from '../utils/Tools';
import ProgressBar from '../components/ProgressBar';
import {withNavigation} from 'react-navigation';
import CalibrationBody, {calibrationSlideCount} from './CalibrationBody';
import SearchableDropdown from 'react-native-searchable-dropdown';


const scaleFactor = 1.5;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

var overlayWidth = screenWidth/1.2;
//var overlayHeight = screenHeight/1.4;
var overlayHeight = 500;

class BottleStatus extends React.Component{
    constructor(props){
        super(props);

        this.reloadPercentage();
    }


    state = {
        level: 'N/A',
        textColor: 'black',
        detailsVisible: false,
        calibrateVisible: false,
        bottleName: 'N/A',
        currentVolume: 'N/A',
        initVolume: 'N/A',
        inputInitVolume: '',
        inputCurrentVolume: '',
        slideNum: 1,
        selectedItem: ''
    }

    getTextColor(num){
        if(num > 50){
            return 'limegreen'
        }else if(num > 15 && num < 50){
            return 'yellow'
        }else if(num === 'N/A'){
            return 'black'
        }else{
            return 'red'
        }
    }

    doneCallback(){
        this.setState({
            detailsVisible: true
        });
    }

    reloadPercentage(){
        //Refresh the bottle percentage
        getBottlePercent(this.props.number).then((response) => {
            //console.log(response)
            this.setState({
                level: response,
                textColor: this.getTextColor(response)
            });
        }).catch((error) => {
            //console.log(error);
            this.setState({
                level: 'N/A',
                textColor: 'black'
            });
        });

        //Refresh the bottle currentVolume
        this.setBottleVolumes();
        
    }

    resetBottle(){
        this.props.reloadCallback();
        this.reloadPercentage();
        this.setState({
            bottleName: 'N/A',
            currentVolume: 'N/A',
            initVolume: 'N/A',
        });
    }

    setBottleVolumes(){
        if(this.state.bottleName != 'N/A'){
            //Set current volume
            getCurrentBottleVolume(this.state.bottleName).then((response) => {
                console.log('Current bottle volume: ' + response);
                this.setState({
                    currentVolume: response
                });
            }).catch((error) => {
                console.log(error);
                this.setState({
                    currentVolume: 'N/A'
                });
            });
            
            //Set Initial volume
            getInitBottleVolume(this.state.bottleName).then((response) => {
                console.log('Initial Volume: ' + response);
                this.setState({
                    initVolume: response
                });
            });
        }
    }

    //Open the instructions for remove/adding a new bottle
    openInstructions(){
        this.props.navigation.navigate('BottleTut', {
            bottleReturn: this.props.number,
            doneCallback: this.doneCallback.bind(this)
        });
        this.setState({
            detailsVisible: false
        });
    }

    processVolumeInput(text, current){
        var isNum = /^\d*$/.test(text);
        if(isNum != 1){
            Alert.alert('Only numbers are a valid input');
        }else{
            if(current){
                this.setState({
                    inputCurrentVolume: text
                });
            }else{
                this.setState({
                    inputInitVolume: text
                });
            }
        }
    }

    //Show bottle instructions on the first time you open a this overlay
    async getShowInstructions(){
        try{
            show = await AsyncStorage.getItem('bottleInstructionsShow');

            if(show === 'false'){
                console.log('Not showing instructions');
            }else{
                //TODO: ADD THIS BACK AFTER WE DETERMINE WHETHER IT WORKS OR NOT
                this.openInstructions();
            }
        }catch(error){
            console.log(error);
        }
    }

    componentDidMount(){

        //Set the bottle name
        getBottleName(this.props.number).then((response) => {
            this.setState({
                bottleName: response
            });
            //console.log('RESPONSE: ' + response);
        }).then(() => {
            //Set the bottle volumes the first time
            this.setBottleVolumes();
        });

        setInterval(() => {
            this.reloadPercentage();
        }, 30000);

        //Need to trigger tutorial if this is the first time seeing this
        //this.getShowInstructions();
        //TODO: Removed temporarily
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    componentDidUpdate(){
        if(this.props.reload){
            console.log('RESETTING BOTTLE!!');
            this.resetBottle();
        }
    }

    render(){
        return(
            <View>
                <TouchableOpacity onPress={() => {
                    this.setState({
                        detailsVisible: true,
                    });
                    console.log('Item: ' + this.state.selectedItem);
                }}>
                    <View>
                        <ImageBackground style={{height: 71*scaleFactor, width: 30*scaleFactor}} source={require('../assets/bottleIcon.png')}>
                            <Spacer height={70} />
                            <Text style={{textAlign: 'center', color: this.state.textColor}}>{this.state.level}</Text>
                        </ImageBackground>
                        <Text style={{textAlign: 'center'}}>{this.props.number}</Text>
                    </View>
                </TouchableOpacity>

                <Overlay isVisible={this.state.detailsVisible} width={overlayWidth} height={overlayHeight} overlayStyle={styles.overlay}>
                    <View style={styles.backButtonRow}>
                        <TouchableOpacity onPress={() => {
                                this.setState({
                                    detailsVisible: false,
                                    selectedItem: ''
                                });

                                console.log('CLOSE Item: ' + this.state.selectedItem);
                            }}>
                            <Icon name='back' size={33} type='antdesign'/>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerStyle}>{this.state.bottleName === 'N/A' ? 'Add New Bottle' : toUpper(this.state.bottleName)}</Text>
                    
                    <View style={styles.bodyContainer}>
                        {this.state.bottleName !== 'N/A' && <View>
                            <View style={styles.progressContainer}>
                                <Text style={{paddingTop: 6, paddingRight: 5, fontSize: 16}}>Level:</Text>
                                <ProgressBar width={220} height={30} value={this.state.level === 'N/A' ? 0 : this.state.level}/>
                                <Spacer height={40} />
                            </View>

                            <View style={styles.statsContainer}>
                                <Text style={styles.textStyle}>Remaining Volume:  {this.state.currentVolume} [mL]</Text>
                                <Text style={styles.textStyle}>Original Volume:  {this.state.initVolume} [mL]</Text>
                            </View>

                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={{textDecorationLine: 'underline', fontSize: 18, textAlign: 'center', alignSelf: 'center', paddingRight: 10, paddingLeft: 30}}>Bottle Management</Text>
                                {//TODO: ICON TEMPORARILY DISABLED FOR RELEASE ISSUE FIX
                                }
                                <Icon name='help' disabled={true} size={28} onPress={() => {
                                    //this.openInstructions();
                                }}/>
                            </View>
                        </View>}
                        
                        {this.state.bottleName !== 'N/A' && <View style={styles.buttonContainer}>
                            <Button title='Remove Bottle' buttonStyle={styles.buttonStyle} onPress={async () => {
                                removeBottle(this.props.number, this.state.bottleName).then((res) => {
                                    if(res === 'true'){
                                        this.resetBottle();
                                    }else if(res === 'busy'){
                                        console.log('Barbot is busy...');
                                        Alert.alert('Barbot is busy! Try again soon.');
                                    }else{
                                        console.log('Error removing bottle ' + this.state.bottleName + ": " + res);
                                    }
                                }).catch((error) => {
                                    console.log('Error removing bottle ' + this.state.bottleName + ": " + error);
                                    Alert.alert('Error removing bottle: ' + error);
                                })
                            }}/>
                            <Spacer height={10}/>
                            <Button title='Prime Bottle' buttonStyle={styles.buttonStyle} onPressIn={() => {
                                pumpOn(this.props.number);
                            }} onPressOut={() => {
                                pumpOff(this.props.number);
                            }}/>
                            <Spacer height={10}/>
                            <Button title={"Calibrate Pump " + this.props.number} buttonStyle={styles.buttonStyle} onPress={() => {
                                this.setState({
                                    detailsVisible: false,
                                    calibrateVisible: true
                                });
                            }}/>
                        </View>}
                        {this.state.bottleName === 'N/A' && <View style={styles.buttonContainer}>
                            <SearchableDropdown 
                                onItemSelect={(item) => {
                                    this.setState({
                                        selectedItem: item['name']
                                    });
                                }}
                                  containerStyle={{ padding: 5 }}
                                  itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: '#ddd',
                                    borderColor: '#bbb',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                  }}
                                  itemTextStyle={{ color: '#222' }}
                                  itemsContainerStyle={{ maxHeight: 120 }}
                                  items={this.props.bottleItems}
                                  resetValue={false}
                                  textInputProps={
                                    {
                                      placeholder: "Select a bottle...",
                                      underlineColorAndroid: "transparent",
                                      style: {
                                          padding: 12,
                                          borderWidth: 1,
                                          borderColor: '#ccc',
                                          borderRadius: 5,
                                          backgroundColor: 'white',
                                          width: overlayWidth/1.5
                                      },
                                      onTextChange: text => console.log(text)
                                    }
                                  }
                                  listProps={
                                    {
                                      nestedScrollEnabled: true,
                                    }
                                  }
                            />
                            <Spacer height={10} />
                            <Text style={styles.textStyle}>Current Bottle Volume (mL):</Text>
                            <TextInput
                                style={{width: overlayWidth/3, height: 30, backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, borderRadius: 5}}
                                keyboardType='number-pad'
                                onChangeText={(text) => {this.processVolumeInput(text, true)}}
                                maxLength={4}
                                value={this.state.inputCurrentVolume}
                            />

                            <Spacer height={10} />
                            <Text style={styles.textStyle}>Initial Bottle Volume (mL):</Text>
                            <TextInput
                                style={{width: overlayWidth/3, height: 30, backgroundColor: 'white', borderColor: 'gray', borderWidth: 1, borderRadius: 5}}
                                keyboardType='number-pad'
                                onChangeText={(text) => {this.processVolumeInput(text, false)}}
                                maxLength={4}
                                value={this.state.inputInitVolume}
                            />
                            <Spacer height={10} />

                            <Button title='Add Bottle' disabled={this.state.selectedItem === '' || this.state.inputCurrentVolume === '' || this.state.inputInitVolume === ''} buttonStyle={styles.buttonStyle} onPress={async () => {
                                //TODO: make api call to add the bottle

                                var res = await addBottle(this.state.selectedItem, this.props.number, this.state.inputCurrentVolume, this.state.inputInitVolume);
                                console.log('ADDING BOTTLE RESULT: ' + res);
                                this.setState({
                                    selectedItem: '',
                                    inputCurrentVolume: '',
                                    inputInitVolume: ''
                                });

                                this.componentDidMount();
                                this.props.reloadCallback();
                                this.reloadPercentage();

                            }} />
                        </View>}
                    </View>
                </Overlay>

                <Overlay isVisible={this.state.calibrateVisible} width={overlayWidth} height={overlayHeight} overlayStyle={styles.overlay}>
                    <View style={styles.backButtonRow}>
                        <TouchableOpacity onPress={() => {
                                this.setState({
                                    detailsVisible: true,
                                    calibrateVisible: false,
                                    slideNum: 1,
                                    selectedItem: ''
                                });
                            }}>
                            <Icon name='back' size={33} type='antdesign'/>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.headerStyle}>{"Calibrate Pump " + this.props.number}</Text>
                    <Spacer height={10} />
                    <CalibrationBody slide={this.state.slideNum} pumpNum={this.props.number}/>
                    
                    <View style={styles.calibrateControl}>
                        {this.state.slideNum > 1 && <Button title='Prev' buttonStyle={styles.calibrateButtons} onPress={() => {
                            this.setState({
                                slideNum: this.state.slideNum-1
                            });
                        }} />}

                        {this.state.slideNum < calibrationSlideCount && <Button title='Next' buttonStyle={styles.calibrateButtons} onPress={() => {
                            this.setState({
                                slideNum: this.state.slideNum+1
                            });
                        }}/>}

                        {this.state.slideNum === calibrationSlideCount && <Button title='Done' buttonStyle={styles.calibrateButtons} onPress={() => {
                            this.setState({
                                detailsVisible: true,
                                calibrateVisible: false,
                                slideNum: 1
                            });
                        }}/>}
                    </View>
                </Overlay>
            </View>
        );
    }
}

export default withNavigation(BottleStatus);


const styles = StyleSheet.create({

    overlay: {
        borderRadius: 20,
        backgroundColor: 'lightgray'
    },

    backButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    },

    headerStyle: {
        fontSize: 20,
        textAlign: 'center',
        textDecorationLine: 'underline'
    },

    bodyContainer: {
        flexDirection: 'column',
        paddingTop: 10,
    },

    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        width: overlayWidth
    },

    buttonContainer: {
        alignSelf: 'center',
        paddingTop: 20,
        alignItems: 'center'
    },

    calibrateButtons: {
        borderRadius: 20,
        width: 70,
        backgroundColor: '#7295A6'
    },

    statsContainer: {
        paddingTop: 10,
        paddingBottom: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        width: overlayWidth,
        right: 10
    },

    textStyle: {
        fontSize: 18,
        paddingLeft: 10
    },

    buttonStyle: {
        borderRadius: 20,
        width: 175,
        backgroundColor: '#7295A6'
    },

    calibrateControl: {
        paddingTop: 20,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    }
});