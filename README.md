# Dynamic Redux Tools
This module is a wrapper around createStore from redux-toolkit.
It provides the ability to add reducers/middleware asynchronously.

## How to use

### Installation
1. Install the dependency `yarn add dynamic-redux-tools`
2. Install the original toolkit `yarn add @reduxjs/toolkit`

### Configuration
Global configuration:
````
import { configureGlobalStore } from 'dynamic-redux-tools';

export const store = configureGlobalStore({
  reducer: {
    base: (state = {}) => state
  }
});
````

Async injections (federated module, microfrontend, lazy component)
````
store.injectAsyncConfig({
  reducer: {
    [exampleReducerPath]: exampleReducer,
  },
  middleware: [exampleMiddleware],
});
````

Can create isolated store, without adding async options, useful for MF.
````
export const store = configureIsolatedStore({
  reducer: {
    [exampleReducerPath]: exampleReducer,
  },
  middleware: [exampleMiddleware],
});
````
