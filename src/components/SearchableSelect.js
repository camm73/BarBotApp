/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, FlatList, TextInput, Keyboard} from 'react-native';
import {Button} from 'react-native-elements';

const defaultHeight = 40;
const defaultBorderRadius = 8;

//Needs (data and selectItemCallback) as props
class SearchableSelect extends React.Component {
  constructor(props) {
    super(props);

    this.input = React.createRef();
  }
  state = {
    listVisible: false,
    inputText: '',
    ignoreDefault: false,
    isScrolling: false,
  };

  componentDidMount() {}

  componentDidUpdate() {
    if (this.props.reset && this.state.inputText !== '') {
      this.setState({
        inputText: '',
        ignoreDefault: false,
      });
    }

    if (this.props.reset && this.props.initialItem !== '') {
      this.props.clearInitialItems();
    }
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder={this.props.placeholder}
          autoCorrect={false}
          ref={this.input}
          returnKeyType="done"
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
          value={
            this.state.ignoreDefault
              ? this.state.inputText
              : this.props.initialItem
          }
          onChangeText={text => {
            this.setState({
              ignoreDefault: true,
              inputText: text,
            });
          }}
          onFocus={() => {
            this.setState({
              listVisible: true,
            });
          }}
          onSubmitEditing={() => {
            this.setState({
              listVisible: false,
            });
          }}
          onBlur={() => {
            if (!this.state.isScrolling) {
              this.setState({
                listVisible: false,
              });
            }
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
            onScrollBeginDrag={() => {
              this.setState({
                isScrolling: true,
              });
            }}
            decelerationRate={0.99}
            onMomentumScrollEnd={() => {
              if (!this.input.current.isFocused()) {
                this.input.current.focus();
              }
              this.setState({
                isScrolling: false,
              });
            }}
            keyExtractor={(item, index) => item.name}
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
                  //console.log('Selected: ' + item.value);
                  this.setState({
                    inputText: item.value,
                    listVisible: false,
                    ignoreDefault: true,
                  });
                  Keyboard.dismiss();
                  this.props.selectItemCallback(item.value);
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
