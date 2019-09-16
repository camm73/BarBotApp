import React from 'react';
import {Text, View, StyleSheet, Button, Dimensions} from 'react-native';
//import {Button} from 'react-native-elements';
import Spacer from '../components/Spacer';
import {withNavigation, SafeAreaView} from 'react-navigation';
import {Icon} from 'react-native-elements';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class HeaderComponent extends React.Component {

    render(){

        if(this.props.backVisible || this.props.settingsVisible){
            return(
                <SafeAreaView style={styles.safeStyle}>
                    <View style={styles.backContainer}>
                    <View style={styles.buttonContainer}>
                        {this.props.backVisible && <Button title='Go Back' style={styles.buttonStyle} onPress={() => {
                            this.props.navigation.navigate('Home');
                        }}/>}
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.textStyle}>BarBot</Text>
                    </View>
                    <View style={styles.rightSide}>
                        {this.props.settingsVisible && <Icon name='settings' size={32} onPress={() => {
                            this.props.navigation.navigate('Settings');
                        }}/>
                        }
                    </View>
                </View>
                </SafeAreaView>
            );
        }else{
            return(
                <SafeAreaView style={styles.safeStyle}>
                    <View style={styles.container}>
                        <View style={styles.textContainer}>
                            <Text style={styles.textStyle}>BarBot</Text>
                        </View>
                    </View>
                </SafeAreaView>
            );
        }
    }
}

export default withNavigation(HeaderComponent);


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1C404F',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
    },

    backContainer: {
        backgroundColor: '#1C404F',
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        flexDirection: 'row',
    },

    safeStyle: {
        backgroundColor: '#1C404F'
    },

    buttonContainer: {
        flex: 1
    },

    buttonStyle: {
        alignSelf: 'flex-start'
    },

    textContainer: {
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        flex: 1
    },

    rightSide: {
        flex: 1
    },

    textStyle: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 28,
        fontFamily: 'Chalkboard SE',
    }
});