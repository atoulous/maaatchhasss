import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

const render = (Component) => {
  ReactDOM.render(
    <Component />,
    document.getElementById('app')
  );
};

render(App);
