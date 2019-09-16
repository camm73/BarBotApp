import React from 'react';
import {View, Alert, ImageBackground, Text, Dimensions, StyleSheet, AsyncStorage} from 'react-native';
import {Overlay, Icon, Button} from 'react-native-elements';
import Spacer from './Spacer';
import {getBottlePercent, getBottleName, removeBottle, getCurrentBottleVolume, getInitBottleVolume, replaceBottle, pumpOn, pumpOff} from '../api/Control';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {toUpper} from '../utils/Tools';
import ProgressBar from '../components/ProgressBar';
import {withNavigation} from 'react-navigation';


const scaleFactor = 1.5;
var bottleNumber;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

var overlayWidth = screenWidth/1.2;
var overlayHeight = screenHeight/1.8;

class BottleStatusTest extends React.Component{
    constructor(props){
        super(props);

        bottleNumber = this.props.number;
        this.reloadPercentage();
    }

    state = {
        level: 'N/A',
        textColor: 'black',
        detailsVisible: false,
        bottleName: '',
        currentVolume: 'N/A',
        initVolume: 'N/A'
    }

    getTextColor(num){
        if(num > 50){
            return 'limegreen'
        }else if(num > 15 && num < 50){
            return 'yellow'
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
            console.log(response)
            this.setState({
                level: response,
                textColor: this.getTextColor(response)
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                level: '20', //TODO: Change after done testing
                textColor: 'black'
            });
        });

        //Refresh the bottle currentVolume
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
    }

    //Open the instructions for remove/adding a new bottle
    openInstructions(){
        this.props.navigation.navigate('BottleTut', {
            bottleReturn: bottleNumber,
            doneCallback: this.doneCallback.bind(this)
        });
        this.setState({
            detailsVisible: false
        });
    }

    //Show bottle instructions on the first time you open a this overlay
    async getShowInstructions(){
        try{
            show = await AsyncStorage.getItem('bottleInstructionsShow');

            if(show === 'false'){
                console.log('Not showing instructions');
            }else{
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
        });

        //Set the initial bottle volume
        getInitBottleVolume(this.state.bottleName).then((response) => {
            this.setState({
                initVolume: response
            });
        });

        setInterval(() => {
            this.reloadPercentage();
        }, 30000);

        //Need to trigger tutorial if this is the first time seeing this
        this.getShowInstructions();
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    render(){
        return(
            <View>
                <TouchableOpacity disabled={this.state.level === 'N/A'} onPress={() => {
                    this.setState({
                        detailsVisible: true
                    });
                }}>
                    <View>
                        <ImageBackground style={{height: 71*scaleFactor, width: 30*scaleFactor, alignItems: 'baseline'}} source={require('../assets/bottleIcon.png')}>
                            
                        </ImageBackground>
                        <Text style={{textAlign: 'center'}}>{this.props.number}</Text>
                    </View>
                </TouchableOpacity>

                <Overlay isVisible={this.state.detailsVisible} width={overlayWidth} height={overlayHeight} overlayStyle={styles.overlay}>
                    <View style={styles.backButtonRow}>
                        <TouchableOpacity onPress={() => {
                                this.setState({
                                    detailsVisible: false
                                });
                            }}>
                            <Icon name='back' size={33} type='antdesign'/>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.headerStyle}>{toUpper(this.state.bottleName)}</Text>
                    
                    <View style={styles.bodyContainer}>
                        <View style={styles.progressContainer}>
                            <Text style={{paddingTop: 6, paddingRight: 5, fontSize: 16}}>Level:</Text>
                            <ProgressBar width={220} height={30} value={this.state.level === 'N/A' ? 0 : this.state.level}/>
                            <Spacer height={40} />
                        </View>

                        <View style={styles.statsContainer}>
                            <Text style={styles.textStyle}>Remaining Volume:  {this.state.currentVolume} [mL]</Text>
                            <Text style={styles.textStyle}>Original Volume:  {this.state.initVolume} [mL]</Text>
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            <Button title='Remove Bottle' buttonStyle={styles.buttonStyle} onPress={() => {
                                removeBottle(bottleNumber);
                            }}/>
                            <Spacer height={10}/>
                            <Button title='Replace Bottle' buttonStyle={styles.buttonStyle} onPress={() => {
                                replaceBottle(bottleNumber);
                            }}/>
                            <Spacer height={10}/>
                            <Button title='Prime Bottle' buttonStyle={styles.buttonStyle} onPressIn={() => {
                                pumpOn(bottleNumber);
                            }} onPressOut={() => {
                                pumpOff(bottleNumber);
                            }}/>
                            <Spacer height={10}/>
                            <Button title='Test Tutorial' buttonStyle={styles.buttonStyle} onPress={() => {
                                this.openInstructions();
                            }} />
                            <Spacer height={10}/>
                        </View>
                    </View>
                </Overlay>
            </View>
        );
    }
}

export default withNavigation(BottleStatusTest);


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
        paddingTop: 20
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
    }
});