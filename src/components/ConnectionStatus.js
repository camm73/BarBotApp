import React from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {isOnline} from '../api/Control';

class ConnectionStatus extends React.Component{

    state = {
        color: 'red',
        textContent: 'Disconnected'
    }

    checkOnline(){
        isOnline().then((response) => {
            if(response === 'online'){
                this.setState({
                    textContent: 'Connected',
                    color: 'limegreen'
                });
            }
        }).catch((error) => {
            this.setState({
                textContent: 'Disconnected',
                color: 'red'
            });
        });
    }

    componentDidMount(){
        this.checkOnline();
        setInterval(() => {
            this.checkOnline();
        }, 15000);
    }

    render(){
        return(
            <View style={{flexDirection: 'row'}}>
                <Text style={{fontSize: 18, color: 'black'}}>Connection Status: </Text>
                <Text style={{fontSize: 18, color: this.state.color}}>{this.state.textContent}</Text>
            </View>
        );
    }
}

export default ConnectionStatus;


const styles = StyleSheet.create({
    
});