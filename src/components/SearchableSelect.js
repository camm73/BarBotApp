/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, StyleSheet, TextInput, Keyboard} from 'react-native';
import {Button} from 'react-native-elements';

const data = [
  {id: '1', name: 'Test1'},
  {id: '2', name: 'Test2'},
  {id: '3', name: 'Test3'},
  {id: '4', name: 'blah'},
  {id: '5', name: 'margarita'},
];

const defaultWidth = 120;
const defaultHeight = 40;
const defaultBorderRadius = 8;
const defaultListHeight = 130;

class SearchableSelect extends React.Component {
  state = {
    listVisible: false,
    inputText: '',
  };

  componentDidMount() {}

  render() {
    return (
      <View>
        <TextInput
          style={{
            width: this.props.width,
            height:
              this.props.height !== undefined
                ? this.props.height
                : defaultHeight,
            borderColor:
              this.props.borderColor !== undefined
                ? this.props.borderColor
                : 'lightgray',
            borderWidth:
              this.props.borderWidth !== undefined ? this.props.borderWidth : 1,
            borderRadius: 8,
            backgroundColor: 'white',
            padding: 5,
            marginBottom: 5,
          }}
          value={this.state.inputText}
          onChangeText={text => {
            this.setState({
              inputText: text,
            });
          }}
          onFocus={() => {
            this.setState({
              listVisible: true,
            });
          }}
          onBlur={() => {
            this.setState({
              listVisible: false,
            });
          }}
        />
        {this.state.listVisible && (
          <FlatList
            data={this.props.data.filter(({name}) =>
              name.match(new RegExp(this.state.inputText, 'gi')),
            )}
            style={{
              maxHeight:
                this.props.listHeight !== undefined
                  ? this.props.listHeight
                  : 120,
            }}
            keyboardShouldPersistTaps={'handled'}
            renderItem={({item}) => (
              <Button
                primary
                title={item.name}
                titleStyle={{
                  color: 'black',
                  fontSize: 15,
                }}
                style={{marginBottom: 5}}
                buttonStyle={{
                  width: this.props.width,
                  height:
                    this.props.height !== undefined
                      ? this.props.height
                      : defaultHeight - 5,
                  borderRadius:
                    this.props.borderRadius !== undefined
                      ? this.props.borderRadius
                      : defaultBorderRadius,
                  backgroundColor: 'silver',
                  borderColor: 'black',
                  borderWidth: 1,
                  padding: 0,
                }}
                onPress={() => {
                  this.setState({
                    inputText: item.name,
                    listVisible: false,
                  });
                  Keyboard.dismiss();
                  console.log('Item: ' + item.name + ' pressed button');
                }}
              />
            )}
          />
        )}
      </View>
    );
  }
}

export default SearchableSelect;

const styles = StyleSheet.create({});
