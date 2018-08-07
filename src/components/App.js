import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { store } from '../utils/store';
import Header from './Header';
import Torso from './Torso';
import '../styles/App.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="app-box">
          <Header />
          <Torso />
        </div>
      </Provider>
    );
  }
}

export default App;
