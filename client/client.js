import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import { App } from './components/App';

render(
  <AppContainer>
    <App />
  </AppContainer>,
  document.getElementById('app')
);

// Webpack Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/App', () => render(App));
}
