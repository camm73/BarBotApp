import React from 'react';
import {View, Alert, ImageBackground, Text, Dimensions, StyleSheet} from 'react-native';
import {Overlay, Icon, Button} from 'react-native-elements';
import Spacer from './Spacer';
import {getBottlePercent, getBottleName} from '../api/Control';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {toUpper} from '../utils/Tools';
import ProgressBar from '../components/ProgressBar';

const scaleFactor = 1.5;
var bottleNumber;

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

var overlayWidth = screenWidth/1.2;
var overlayHeight = screenHeight/1.8;

class BottleStatus extends React.Component{
    constructor(props){
        super(props);

        bottleNumber = this.props.number;
        this.reloadPercentage();
    }

    state = {
        level: 'N/A',
        textColor: 'black',
        detailsVisible: false,
        bottleName: ''
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

    reloadPercentage(){
        getBottlePercent(this.props.number).then((response) => {
            this.setState({
                level: response,
                textColor: this.getTextColor(response)
            });
        }).catch((error) => {
            console.log(error);
            this.setState({
                level: 'N/A',
                textColor: 'black'
            });
        });
    }

    componentDidMount(){

        getBottleName(this.props.number).then((response) => {
            this.setState({
                bottleName: response
            });
        });

        setInterval(() => {
            this.reloadPercentage();
        }, 30000);
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
                            <ProgressBar width={200} height={30} value={this.state.level === 'N/A' ? 0 : this.state.level}/>
                            <Spacer height={40} />
                        </View>

                        <View style={styles.statsContainer}>
                            <Text style={styles.textStyle}>Remaining Volume: {}</Text>
                            <Text style={styles.textStyle}>Original Volume: {}</Text>
                        </View>
                        
                        <View style={styles.buttonContainer}>
                            <Button title='Remove Bottle' buttonStyle={styles.buttonStyle}/>
                            <Spacer height={10}/>
                            <Button title='Replace Bottle' buttonStyle={styles.buttonStyle}/>
                            <Spacer height={10}/>
                            <Button title='Prime Bottle' buttonStyle={styles.buttonStyle}/>
                            <Spacer height={10}/>
                        </View>
                    </View>
                </Overlay>
            </View>
        );
    }
}

export default BottleStatus;


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