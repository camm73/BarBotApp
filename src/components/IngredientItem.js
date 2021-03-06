/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import Spacer from './Spacer';
import SearchableSelect from '../components/SearchableSelect';

class IngredientItem extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedItem: '',
    selectedAmount: '',
    resetText: false,
    value: '',
    amountChanged: false,
    ingredChanged: false,
  };

  //Resets all selection components
  resetSelectComponents() {
    this.setState({
      triggerReset: true,
      amountChanged: false,
      ingredChanged: false,
    });

    setTimeout(() => {
      this.setState({
        triggerReset: false,
      });
    }, 500);
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <SearchableSelect
            data={this.props.bottleItems}
            reset={this.state.triggerReset}
            initialItem={this.props.selectedItem}
            placeholder={'Select an ingredient...'}
            clearInitialItems={this.props.clearInitialItems}
            width={this.props.overlayWidth / 1.5}
            selectItemCallback={item => {
              //console.log('Setting ingredient to :' + item);
              this.setState({
                selectedItem: item,
                ingredChanged: true,
              });
            }}
          />

          <SearchableSelect
            data={amountItems}
            reset={this.state.triggerReset}
            initialItem={this.props.selectedAmount}
            placeholder={'Amount'}
            width={this.props.overlayWidth / 4.5}
            clearInitialItems={this.props.clearInitialItems}
            selectItemCallback={item => {
              //console.log('Setting amount to :' + item);
              this.setState({
                selectedAmount: item,
                amountChanged: true,
              });
            }}
          />
        </View>

        <View style={styles.container}>
          <Button
            title="Clear Ingredient"
            titleStyle={styles.buttonText}
            buttonStyle={styles.clearButton}
            onPress={this.resetSelectComponents.bind(this)}
          />
          <Button
            title="Add Ingredient"
            titleStyle={styles.buttonText}
            buttonStyle={styles.lightButtonStyle}
            onPress={() => {
              if (this.state.ingredChanged && this.state.amountChanged) {
                if (
                  this.state.selectedAmount === '' ||
                  this.state.selectedItem === ''
                ) {
                  Alert.alert(
                    'You must select both an ingredient and amount before adding.',
                  );
                  return;
                }
                //console.log('Both changed');
                this.props.ingredCallback(this.state.selectedItem);
                this.props.amountCallback(this.state.selectedAmount);
              } else if (
                this.state.ingredChanged &&
                !this.state.amountChanged
              ) {
                //console.log('Ingred changed: ' + this.state.selectedItem);
                this.props.ingredCallback(this.state.selectedItem);
                this.props.amountCallback(this.props.selectedAmount);
              } else if (
                !this.state.ingredChanged &&
                this.state.amountChanged
              ) {
                //console.log('Amount changed: ' + this.state.selectedAmount);
                this.props.ingredCallback(this.props.selectedItem);
                this.props.amountCallback(this.state.selectedAmount);
              } else {
                this.props.ingredCallback(this.props.selectedItem);
                this.props.amountCallback(this.props.selectedAmount);
              }

              this.setState({
                selectedAmount: '',
                selectedItem: '',
              });

              this.resetSelectComponents();
            }}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 5,
  },

  ingredient: {
    flexDirection: 'column',
  },

  lightButtonStyle: {
    borderRadius: 20,
    width: 140,
    backgroundColor: '#7295A6',
    alignSelf: 'center',
  },

  clearButton: {
    borderRadius: 20,
    width: 140,
    backgroundColor: 'red',
  },

  buttonText: {
    fontSize: 16,
  },
});

const amountItems = [
  {
    id: 0,
    name: '0.25 oz',
    value: '0.25',
  },
  {
    id: 1,
    name: '0.5 oz',
    value: '0.5',
  },
  {
    id: 2,
    name: '0.75 oz',
    value: '0.75',
  },
  {
    id: 3,
    name: '1.0 oz',
    value: '1.0',
  },
  {
    id: 4,
    name: '1.25 oz',
    value: '1.25',
  },
  {
    id: 5,
    name: '1.5 oz',
    value: '1.5',
  },
  {
    id: 6,
    name: '1.75 oz',
    value: '1.75',
  },
  {
    id: 7,
    name: '2.0 oz',
    value: '2.0',
  },
  {
    id: 8,
    name: '2.25 oz',
    value: '2.25',
  },
  {
    id: 9,
    name: '2.5 oz',
    value: '2.5',
  },
  {
    id: 10,
    name: '2.75 oz',
    value: '2.75',
  },
  {
    id: 11,
    name: '3.0 oz',
    value: '3.0',
  },
  {
    id: 12,
    name: '3.5 oz',
    value: '3.5',
  },
  {
    id: 13,
    name: '4.0 oz',
    value: '4.0',
  },
  {
    id: 14,
    name: '4.5 oz',
    value: '4.5',
  },
  {
    id: 15,
    name: '5.0 oz',
    value: '5.0',
  },
  {
    id: 16,
    name: '6.0 oz',
    value: '6.0',
  },
];

export default IngredientItem;
