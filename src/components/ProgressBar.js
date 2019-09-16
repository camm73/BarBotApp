import React from 'react';
import {View, StyleSheet, Text} from 'react-native';

class ProgressBar extends React.Component {


    getColor(){
        if(this.props.value >= 50){
            return 'green';
        }else if(this.props.value > 15 && this.props.value < 50){
            return 'gold';
        }else if(this.props.value < 15){
            return 'red';
        }
    }

    render(){
        return(
            <View style={{
                width: this.props.width,
                height: this.props.height,
                borderColor: 'black',
                borderWidth: 2,
                borderRadius: 5,
                padding: 1,
            }}>
                <View style={{
                    height: this.props.height-6,
                    width: (this.props.value/100)*this.props.width,
                    backgroundColor: this.getColor(),
                    borderRadius: 3,
                    padding: 1
                }}>
                    <Text style={{position: 'absolute', left: (this.props.width/2)-25, paddingTop: this.props.height/7}}>{this.props.value + "%"}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
});

export default ProgressBar