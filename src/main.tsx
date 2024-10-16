/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import store from './app/redux/store/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);
