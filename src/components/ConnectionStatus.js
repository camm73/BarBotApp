/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import {isOnline} from '../api/Control';

class ConnectionStatus extends React.Component {
  _isMounted = false;

  state = {
    color: 'red',
    textContent: 'Disconnected',
    hearbeatRunning: false,
  };

  onlineInterval = undefined;

  //Checks whether BarBot is online and set's displayed status
  checkOnline() {
    isOnline()
      .then(response => {
        if (response === 'online' && this._isMounted) {
          var makeChange = this.state.textContent === 'Disconnected';
          this.setState({
            textContent: 'Connected',
            color: 'limegreen',
          });
          this.props.toggleConnected(true);

          //Reload if state changed
          if (makeChange) {
            this.props.reloadCallback();
          }
        }
      })
      .catch(error => {
        if (this._isMounted) {
          var makeChange = this.state.textContent === 'Connected';
          this.setState({
            textContent: 'Disconnected',
            color: 'red',
          });
          this.props.toggleConnected(false);

          //Reload main screen if connection state changes
          if (makeChange) {
            this.props.reloadCallback();
          }
        }
        console.log(error);
      });
  }

  componentDidMount() {
    this._isMounted = true;

    this.checkOnline();

    if (!this.state.hearbeatRunning) {
      this.onlineInterval = setInterval(() => {
        this.checkOnline();
      }, 10000);
      this.setState({
        hearbeatRunning: true,
      });
    }
  }

  //Stop state from updating after unmount
  componentWillUnmount() {
    this._isMounted = false;
    clearInterval(this.onlineInterval);
  }

  render() {
    return (
      <View style={{flexDirection: 'row'}}>
        <Text style={{fontSize: 18, color: 'black'}}>Connection Status: </Text>
        <Text style={{fontSize: 18, color: this.state.color}}>
          {this.state.textContent}
        </Text>
      </View>
    );
  }
}

export default ConnectionStatus;
