import { createStore } from 'redux';

import reducer from '../reducer';

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__;

// Create Redux store with initial state
export const store = (module.hot && module.hot.data && module.hot.data.store)
  ? module.hot.data.store
  : createStore(
    reducers, preloadedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
