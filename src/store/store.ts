import { AnyAction, Middleware, ReducersMapObject } from 'redux';
import { CurriedGetDefaultMiddleware } from '@reduxjs/toolkit/src/getDefaultMiddleware';

import {
  EnhancedStore,
  configureStore,
  combineReducers,
} from '@reduxjs/toolkit';

import { createDynamicMiddleware } from '../middlewares/dynamicMiddleware';

export type AsyncState = any; // eslint-disable-line

export interface AsyncConfigureStoreOptions {
  reducer: ReducersMapObject;
  middleware?: Middleware[];
}

export interface AsyncStore extends EnhancedStore<AsyncState, AnyAction, Middleware<AsyncState>[]> {
  asyncReducers?: ReducersMapObject;
  injectAsyncConfig?: (config: AsyncConfigureStoreOptions) => void;
}

export const createMiddlewares = (
  originalMiddlewares: Middleware[] = [],
  extendedMiddlewares: Middleware[] = []
) => {
  return (getDefaultMiddleware: CurriedGetDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(originalMiddlewares)
      .concat(extendedMiddlewares);
  };
};

export const configureIsolatedStore = (
  options: AsyncConfigureStoreOptions
): EnhancedStore => {
  return configureStore({
    ...options,
    middleware: createMiddlewares(options.middleware),
  });
};

export const configureGlobalStore = (
  options: AsyncConfigureStoreOptions
): AsyncStore => {
  const dynamicMiddleware = createDynamicMiddleware();

  const store: AsyncStore = configureStore({
    ...options,
    middleware: createMiddlewares(options.middleware, [
      dynamicMiddleware.middleware,
    ]),
  });

  store.asyncReducers = {};

  store.injectAsyncConfig = (config: AsyncConfigureStoreOptions) => {
    if (store.asyncReducers && config.reducer) {
      store.asyncReducers = {
        ...store.asyncReducers,
        ...config.reducer,
        ...options.reducer,
      };

      const reducers = combineReducers({
        ...options.reducer,
        ...store.asyncReducers,
      });

      store.replaceReducer(reducers);
    }

    if (config.middleware) {
      dynamicMiddleware.addMiddlewares(config.middleware);
    }
  };

  return store;
};
