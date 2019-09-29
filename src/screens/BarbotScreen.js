import React from 'react';
import {View, StyleSheet, Dimensions, Text, Alert, TouchableOpacity, TextInput} from 'react-native';
import {Button, Overlay, Icon} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import HeaderComponent from '../components/HeaderComponent';
import Spacer from '../components/Spacer';
import {addNewBottle} from '../api/Control';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;


class BarbotScreen extends React.Component {

    static navigationOptions = {
        header: (
            <HeaderComponent backVisible={true}/>
        ),
    }

    state = {
        newBottleVisible: false,
        inputBottle: ''
    }

    render(){
        return(
            <View style={styles.mainView}>
                <Text style={styles.headerText}>Manage Menu</Text>
                <Button title='New Bottle' buttonStyle={styles.buttonStyle} onPress={() => {
                    this.setState({
                        newBottleVisible: true
                    });
                }}/>

                <Overlay isVisible={this.state.newBottleVisible} width={screenWidth/1.3} height={screenHeight/4} overlayStyle={styles.overlay}>
                    <View style={styles.backButtonRow}>
                        <TouchableOpacity onPress={() => {
                                this.setState({
                                    newBottleVisible: false
                                });
                            }}>
                            <Icon name='back' size={33} type='antdesign'/>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.textStyle}>Add Bottle</Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 18, marginTop: 10}}>Bottle Name: </Text>
                        <TextInput style={styles.textInput} maxLength={24} onChangeText={(text) => {
                            this.setState({
                                inputBottle: text
                            });
                        }}/>
                    </View>
                    <Spacer height={20} />
                    <Button title='Add Bottle' buttonStyle={styles.lightButtonStyle} onPress={() => {
                        addNewBottle(this.state.inputBottle);
                        this.setState({
                            newBottleVisible: false,
                            inputBottle: ''
                        });
                    }}/>
                </Overlay>
            </View>
        );
    }
}

export default withNavigation(BarbotScreen);


const styles = StyleSheet.create({
    mainView: {
        alignItems: 'center',
        width: screenWidth,
        height: screenHeight,
        backgroundColor: '#617E8C'
    },

    headerText: {
        fontSize: 22,
        textDecorationLine: 'underline',
        paddingBottom: 10
    },

    buttonStyle: {
        backgroundColor: '#3E525C',
        paddingHorizontal: 10,
        borderRadius: 10,
    },

    lightButtonStyle: {
        borderRadius: 20,
        width: 175,
        backgroundColor: '#7295A6',
        alignSelf: 'center'
    },

    textStyle: {
        fontSize: 20,
        textDecorationLine: 'underline',
        textAlign: 'center'
    },

    textInput: {
        height: 40,
        width: screenWidth/2.5,
        borderColor: 'gray',
        borderWidth: 2,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 15,
        paddingHorizontal: 7
    },

    overlay: {
        borderRadius: 20,
        backgroundColor: 'lightgray'
    },

    backButtonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'flex-start'
    },
});