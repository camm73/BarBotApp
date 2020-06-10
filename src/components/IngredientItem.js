/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {Button} from 'react-native-elements';
import Spacer from './Spacer';

class IngredientItem extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedItem: '',
    selectedAmount: '',
    resetText: false,
    value: '',
  };

  render() {
    return (
      <View>
        <View style={styles.container}>
          <View style={styles.ingredient}>
            <SearchableDropdown
              onItemSelect={item => {
                this.setState({
                  selectedItem: item.name,
                });
              }}
              containerStyle={{padding: 5}}
              itemStyle={{
                padding: 10,
                marginTop: 2,
                backgroundColor: '#ddd',
                borderColor: '#bbb',
                borderWidth: 1,
                borderRadius: 5,
              }}
              itemTextStyle={{color: '#222'}}
              itemsContainerStyle={{maxHeight: 120}}
              items={this.props.bottleItems}
              resetValue={this.state.resetText}
              textInputProps={{
                placeholder: 'Select an ingredient...',
                underlineColorAndroid: 'transparent',
                value: this.state.selectedItem,
                style: {
                  padding: 12,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 5,
                  backgroundColor: 'white',
                  width: this.props.overlayWidth / 1.5,
                },
                onTextChange: text =>
                  this.setState({
                    selectedItem: text,
                  }),
              }}
              listProps={{
                nestedScrollEnabled: true,
              }}
            />
          </View>

          <SearchableDropdown
            onItemSelect={item => {
              this.setState({
                selectedAmount: item.name,
              });
            }}
            containerStyle={{padding: 5}}
            itemStyle={{
              padding: 10,
              marginTop: 2,
              backgroundColor: '#ddd',
              borderColor: '#bbb',
              borderWidth: 1,
              borderRadius: 5,
            }}
            itemTextStyle={{color: '#222'}}
            itemsContainerStyle={{maxHeight: 120}}
            items={amountItems}
            resetValue={this.state.resetText}
            textInputProps={{
              placeholder: 'fl oz',
              underlineColorAndroid: 'transparent',
              value: this.state.selectedAmount,
              style: {
                padding: 12,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
                backgroundColor: 'white',
                width:
                  this.props.overlayWidth -
                  (this.props.overlayWidth / 1.5 + 40),
              },
              onTextChange: text =>
                this.setState({
                  selectedAmount: text,
                }),
            }}
            listProps={{
              nestedScrollEnabled: true,
            }}
          />
          <Spacer height={15} />
        </View>

        <Spacer height={20} />
        <Button
          title="Add Ingredient"
          buttonStyle={styles.lightButtonStyle}
          onPress={() => {
            if (
              this.state.selectedAmount !== '' &&
              this.state.selectedItem !== ''
            ) {
              this.props.ingredCallback(this.state.selectedItem);
              this.props.amountCallback(this.state.selectedAmount);
            } else {
              Alert.alert('You must have both an ingredient and amount');
              return;
            }

            this.setState({
              selectedAmount: '',
              selectedItem: '',
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignContent: 'space-between',
    flexDirection: 'row',
  },

  ingredient: {
    flexDirection: 'column',
  },

  lightButtonStyle: {
    borderRadius: 20,
    width: 175,
    backgroundColor: '#7295A6',
    alignSelf: 'center',
  },
});

const amountItems = [
  {
    id: 0,
    name: '0.25 oz',
  },
  {
    id: 1,
    name: '0.5 oz',
  },
  {
    id: 2,
    name: '0.75 oz',
  },
  {
    id: 3,
    name: '1.0 oz',
  },
  {
    id: 4,
    name: '1.25 oz',
  },
  {
    id: 5,
    name: '1.5 oz',
  },
  {
    id: 6,
    name: '1.75 oz',
  },
  {
    id: 7,
    name: '2.0 oz',
  },
  {
    id: 8,
    name: '2.25 oz',
  },
  {
    id: 9,
    name: '2.5 oz',
  },
  {
    id: 9,
    name: '2.75 oz',
  },
  {
    id: 10,
    name: '3.0 oz',
  },
  {
    id: 11,
    name: '3.5 oz',
  },
  {
    id: 12,
    name: '4.0 oz',
  },
  {
    id: 13,
    name: '4.5 oz',
  },
  {
    id: 14,
    name: '5.0 oz',
  },
  {
    id: 15,
    name: '6.0 oz',
  },
];

export default IngredientItem;
