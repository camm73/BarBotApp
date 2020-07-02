import React from 'react';
import {View, StyleSheet, Dimensions, Text, FlatList} from 'react-native';
import HeaderComponent from '../components/HeaderComponent';
import {withNavigation} from 'react-navigation';
import MenuItem from '../components/MenuItem';
import {loadCocktailNames, getThumbnail} from '../api/Cloud';
import Spacer from '../components/Spacer';
import {toUpper} from '../utils/Tools';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

class EditRecipeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <HeaderComponent
          backVisible={true}
          returnPage={'ManageBarbot'}
          reloadCallback={navigation.getParam('reloadCallback')}
        />
      ),
    };
  };

  state = {
    cocktailList: [],
    lastKey: {},
    haltLoading: false,
    loading: false,
    loadNum: 6,
  };

  loadMoreRecipes() {
    //TODO: Add refresh ability

    if (!this.state.loading && !this.state.haltLoading) {
      this.setState({
        loading: true,
      });

      loadCocktailNames(this.state.loadNum, this.state.lastKey)
        .then(res => {
          var cocktailNames = [];

          for (var i = 0; i < res.Items.length; i++) {
            cocktailNames.push({
              name: toUpper(res.Items[i].cocktailName.S),
            });
          }

          this.setState({
            cocktailList: [...this.state.cocktailList, ...cocktailNames],
          });

          //console.log(cocktailNames);
          if (res.hasOwnProperty('LastEvaluatedKey')) {
            this.setState({
              lastKey: res.LastEvaluatedKey,
              loading: false,
            });
          } else {
            this.setState({
              lastKey: {},
              haltLoading: true,
              loading: false,
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  reloadCallback() {
    this.setState(
      {
        cocktailList: [],
        loading: false,
        haltLoading: false,
        lastKey: {},
      },
      () => {
        this.loadMoreRecipes();
      },
    );
  }

  componentDidMount() {
    this.props.navigation.setParams({
      reloadCallback: this.reloadCallback.bind(this),
    });
    //Load initial recipes
    this.loadMoreRecipes();
  }

  render() {
    return (
      <View style={styles.mainView}>
        <Text style={styles.headerText}>Modify Recipes</Text>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          data={this.state.cocktailList}
          onEndReachedThreshold={0.8}
          maxToRenderPerBatch={5}
          onEndReached={this.loadMoreRecipes.bind(this)}
          initialNumToRender={this.state.loadNum}
          renderItem={({item}) => (
            <View>
              <MenuItem
                name={item.name}
                editMode={true}
                reloadCallback={this.reloadCallback.bind(this)}
              />
              <Spacer height={25} />
            </View>
          )}
          keyExtractor={(item, index) => item.name}
        />
      </View>
    );
  }
}

export default withNavigation(EditRecipeScreen);

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#617E8C',
  },

  headerText: {
    fontSize: 22,
    textDecorationLine: 'underline',
    paddingBottom: 10,
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
    alignSelf: 'center',
  },

  textStyle: {
    fontSize: 20,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  ingredientText: {
    fontSize: 16,
    textAlign: 'center',
  },

  subtext: {
    fontSize: 18,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },

  textInput: {
    height: 40,
    width: screenWidth / 2.5,
    borderColor: 'gray',
    borderWidth: 2,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 15,
    paddingHorizontal: 7,
  },

  overlay: {
    borderRadius: 20,
    backgroundColor: 'lightgray',
  },

  backButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },

  scrollContainer: {
    marginTop: 5,
    minWidth: screenWidth,
    paddingBottom: 120,
    alignItems: 'center',
  },

  buttonRow: {
    flex: 1,
    flexDirection: 'row',
    maxHeight: 90,
    alignContent: 'center',
  },

  iconText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
