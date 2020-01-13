import React from 'react';
import {View, StyleSheet, Dimensions, Text, Alert, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import {Button, Overlay, Icon} from 'react-native-elements';
import {withNavigation} from 'react-navigation';
import HeaderComponent from '../components/HeaderComponent';
import Spacer from '../components/Spacer';
import {addNewBottle, getAllBottles, addRecipe, cleanPumps, reverse} from '../api/Control';
import IngredientItem from '../components/IngredientItem';
import {toUpper} from '../utils/Tools';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

const recipeOverlayWidth = screenWidth/1.2;
//const recipeOverlayHeight = screenHeight/1.2;
const recipeOverlayHeight = 570;


class BarbotScreen extends React.Component {

    static navigationOptions = {
        header: (
            <HeaderComponent backVisible={true}/>
        ),
    }

    componentDidMount(){
        this.loadBottleList()
    }

    loadBottleList(){
        getAllBottles().then((response) => {
            fullList = []

            for (var i = 0; i < response.length; i++){
                fullList.push({
                    id: i,
                    name: response[i]
                });
            }

            console.log(fullList);

            this.setState({
                fullBottleList: fullList
            });
        });
    }

    state = {
        newBottleVisible: false,
        newRecipeVisible: false,
        inputBottle: '',
        recipeName: '',
        recipeIngredients: [],
        recipeAmounts: [],
        fullBottleList: [],
        ingredientCount: 0,
    }

    setIngredValue(ingredient){
        this.setState({
            ingredientCount: this.state.ingredientCount+1
        });
        this.state.recipeIngredients.push(ingredient);
        this.forceUpdate();
    }

    setAmountValue(amount){
        this.state.recipeAmounts.push(amount);
        this.forceUpdate();
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

                <Overlay isVisible={this.state.newBottleVisible} width={screenWidth/1.3} height={225} overlayStyle={styles.overlay}>
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
                <Spacer height={25} />
                <Button title='Add Cocktail Recipe' buttonStyle={styles.buttonStyle} onPress={() => {
                    this.setState({
                        newRecipeVisible: true
                    });
                }} />

                <Overlay isVisible={this.state.newRecipeVisible} width={recipeOverlayWidth} height={recipeOverlayHeight} overlayStyle={styles.overlay}>
                    <View style={styles.backButtonRow}>
                        <TouchableOpacity onPress={() => {
                                this.setState({
                                    newRecipeVisible: false,
                                    recipeName: '',
                                    recipeIngredients: [],
                                    recipeAmounts: [],
                                    ingredientCount: 0
                                });
                            }}>
                            <Icon name='back' size={33} type='antdesign'/>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.textStyle}>Add Recipe</Text>

                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 18, marginTop: 10}}>Cocktail Name: </Text>
                        <TextInput style={styles.textInput} maxLength={24} onChangeText={(text) => {
                            this.setState({
                                recipeName: text
                            });
                        }}/>
                    </View>
                    <Spacer height={15} />

                    <Text style={styles.subtext}>Ingredients</Text>
                    <Spacer height={5}/>

                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignContent: 'center',
                        maxHeight: 80,
                        height: this.state.ingredientCount*25 < 80 ? this.state.ingredientCount*25 : 80
                    }}>
                        <ScrollView bounces={true} contentContainerStyle={{maxWidth: recipeOverlayWidth-20, width: recipeOverlayWidth-20, backgroundColor: 'gray', borderRadius: 10, borderColor: 'black', borderWidth: 1}}>
                            <View style={{flexDirection: 'row', alignContent: 'space-between', justifyContent: 'space-evenly'}}>
                                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                    {this.state.recipeIngredients.map((ingredient) => (
                                        <Text style={styles.ingredientText}>{toUpper(ingredient)}</Text>
                                    ))
                                    }
                                </View>

                                <View style={{flexDirection: 'column', alignItems: 'center'}}>
                                    {this.state.recipeAmounts.map((amount) => (
                                        <Text style={styles.ingredientText}>{toUpper(amount)}</Text>
                                    ))
                                    }
                                </View>
                            </View>

                        </ScrollView>
                    </View>
                        
                    <Spacer height={5} />

                    <IngredientItem bottleItems={this.state.fullBottleList} overlayWidth={recipeOverlayWidth} ingredCallback={this.setIngredValue.bind(this)} amountCallback={this.setAmountValue.bind(this)}/>

                    <Spacer height={15} />
                    <Button title='Save Recipe' buttonStyle={styles.buttonStyle} onPress={() => {
                        if(this.state.recipeName != '' && this.state.recipeIngredients.length>0 && this.state.recipeAmounts.length>0){
                            var res = addRecipe(this.state.recipeName, this.state.recipeIngredients, this.state.recipeAmounts);
                            this.setState({
                                newRecipeVisible: false,
                                recipeName: '',
                                recipeIngredients: [],
                                recipeAmounts: [],
                                ingredientCount: 0
                            });
                            
                            console.log("RES: " + toString(res));
                        }else{
                            Alert.alert('You must fill out all the appropriate fields!')
                        }
                    }}/>
                </Overlay>
                
                <Spacer height={25} />
                <Button title="Flush Pumps" buttonStyle={styles.buttonStyle} onPress={() => {
                    Alert.alert('Confirm Pump Flush', 'This will flush all pumps for 10 seconds. Be sure to remove all bottles and replace with water prior to flushing! Are you sure you want to continue?', [{text: 'Cancel', onPress: () => console.log('User canceled pump flush!'), style: 'cancel'}, {text: 'Confirm', onPress: () => {
                        console.log("Starting flush of all pumps...");
                        cleanPumps();
                    }}]);
                }}/>

                <Spacer height={25} />
                <Button title="Remove All Bottles" buttonStyle={styles.buttonStyle} onPress={() => {
                    Alert.alert('Confirm Bottle Removal', 'This will return all excess ingredients to their respective bottles. Are you sure you want to continue?', [{text: 'Cancel', onPress: () => console.log('User canceled full bottle removal!'), style: 'cancel'}, {text: 'Confirm', onPress: () => {
                        console.log("Starting removal of all bottles...");
                        reverse().then((response) => {
                            cleanPumps().then((res) => {
                                reverse();
                                console.log('Finished removal of all bottles!');
                                Alert.alert('Successfully replenished bottles');
                            });
                        });
                    }}]);
                }}/>
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

    ingredientText: {
        fontSize: 16,
        textAlign: 'center'
    },

    subtext: {
        fontSize: 18,
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

    scrollContainer: {
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        maxHeight: 50
    },
});