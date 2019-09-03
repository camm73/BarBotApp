import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {withNavigation} from 'react-navigation';
import HeaderComponent from '../components/HeaderComponent';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class BarbotScreen extends React.Component {

    static navigationOptions = {
        header: (
            <HeaderComponent backVisible={true}/>
        ),
    }

    render(){
        return(
            <View style={styles.mainView}></View>
        );
    }
}

export default withNavigation(BarbotScreen);


const styles = StyleSheet.create({
    mainView: {
        textAlign: 'center',
        alignItems: 'center',
        width: screenWidth,
        height: screenHeight,
        backgroundColor: '#617E8C'
    },
});