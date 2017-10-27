import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
// import { Provider } from 'react-redux';
// import { AppContainer } from 'react-hot-loader';
// import Redbox from 'redbox-react';
// import { createStore } from 'redux';

// import store from './store';
import { App } from './components/App';

// const CustomErrorReporter = ({ error }) => <Redbox error={error} />;

// CustomErrorReporter.propTypes = {
//   error: React.PropTypes.instanceOf(Error).isRequired
// };

const AppClient = () => (
  // <AppContainer errorReporter={CustomErrorReporter}>
    // <Provider>
      <Router>
        <App />
      </Router>
    // </Provider>
  // </AppContainer>
);

render(<AppClient />, document.getElementById('app'));
