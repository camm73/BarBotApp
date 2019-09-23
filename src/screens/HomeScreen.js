import React from 'react';
import {Text, View, StyleSheet, Alert, Dimensions, PixelRatio} from 'react-native';
import { Button } from 'react-native-elements';
import Spacer from '../components/Spacer';
import { SafeAreaView, withNavigation } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import HeaderComponent from '../components/HeaderComponent';
import MenuItem from '../components/MenuItem';
import {getCocktailMenu} from '../api/Control';
import {toUpper} from '../utils/Tools';
import ConnectionStatus from '../components/ConnectionStatus';

import cocktailImages from '../config/cocktailImages';
import BottleStatus from '../components/BottleStatus';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

var manageVisible = false;

class HomeScreen extends React.Component {
    constructor(props){
        super(props);
    }

    static navigationOptions = {
        header: (
            <HeaderComponent backVisible={false} settingsVisible={true}/>
        ),
    }

    setCocktailMenu(){
        getCocktailMenu().then((response) => {
            this.setState({
                cocktailMenu: response
            });
            console.log(response);
        }).catch((error) => console.log(error));

        this.forceUpdate();
    }

    componentDidMount(){
       this.setCocktailMenu();
    }

    state = {
        cocktailMenu: []
    }

    render(){
        return(
            <SafeAreaView>
                <View style={styles.mainView}>
                    <View style={styles.statusView}>
                        {/*<Text style={styles.textStyle}>Your BarBot</Text>*/}
                        {/*<Text style={styles.infoText}>Connection Status:</Text>*/}
                        <ConnectionStatus />
                        {false && <Text style={styles.infoText}>Online/Offline:</Text>}
                        <Spacer height={10} />
                        {/*<Text style={{fontSize: 18, textDecorationLine: 'underline'}}>Ingredient Status:</Text>
                        <Spacer height={10} /> */}
                        <View style={styles.bottleContainer}>
                            <BottleStatus number={1} reloadCallback={this.setCocktailMenu.bind(this)}/>
                            <BottleStatus number={2} reloadCallback={this.setCocktailMenu.bind(this)}/>
                            <BottleStatus number={3} reloadCallback={this.setCocktailMenu.bind(this)}/>
                            <BottleStatus number={4} reloadCallback={this.setCocktailMenu.bind(this)}/>
                            <BottleStatus number={5} reloadCallback={this.setCocktailMenu.bind(this)}/>
                            <BottleStatus number={6} reloadCallback={this.setCocktailMenu.bind(this)}/>
                            <BottleStatus number={7} reloadCallback={this.setCocktailMenu.bind(this)}/>
                            <BottleStatus number={8} reloadCallback={this.setCocktailMenu.bind(this)}/>
                        </View>
                        
                        <Spacer height={5} />
                        {manageVisible && <Button title='Manage BarBot' buttonStyle={styles.manageButton} titleStyle={{fontSize: 16}} onPress={() => {
                            //this.props.navigation.navigate('ManageBarbot');
                            
                        }}></Button>}
                    </View>
                    <Spacer height={20}/>
                    <View style={styles.controlView}>
                        <Text style={styles.textStyle}>Menu</Text>
                        <ScrollView bounces={true} contentContainerStyle={{paddingBottom: 90}}>
                            <Spacer height={10} />

                            {this.state.cocktailMenu.map((cocktail) => (
                                <View>
                                    <MenuItem name={toUpper(cocktail)} imageSrc={cocktailImages[cocktail]}/>
                                    <Spacer height={20} />
                                </View>
                            ))}

                        </ScrollView>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({

    mainView: {
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: '#617E8C',
        minHeight: screenHeight
    },

    statusView: {
        borderBottomColor: 'black',
        borderBottomWidth: 2,
        textAlign: 'center',
        alignItems: 'center',
    },

    bottleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    scrollStyle: {
        backgroundColor: 'darkgray'
    },

    controlView: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
    },

    textStyle: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Courier New',
        textDecorationLine: 'underline'
    },

    infoText: {
        fontSize: 18
    },

    buttonStyle: {
        width: screenWidth/2,
        alignSelf: 'center'
    },

    manageButton: {
        backgroundColor: '#3E525C',
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 10,
    },

    menuContainer: {
        alignContent: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
});

export default withNavigation(HomeScreen);