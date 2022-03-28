import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import { App } from './App';
import { Navigator } from './components';

ReactDOM.render(
  <BrowserRouter>
    <Navigator />
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
