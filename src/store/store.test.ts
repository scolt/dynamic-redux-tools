jest.mock('@reduxjs/toolkit', () => ({
  configureStore: jest.fn(),
  combineReducers: jest.fn().mockImplementation((data) => data),
  createAction: jest.fn().mockImplementation((...args) => {
    const RTK = jest.requireActual('@reduxjs/toolkit');
    return RTK.createAction(args);
  }),
}));

import {
  configureGlobalStore,
  configureIsolatedStore
} from './store';
import { createMiddleware } from '../tests.utils';
import { configureStore } from '@reduxjs/toolkit';

describe('store.ts', () => {
  describe('configureGlobalStore', () => {
    it('should extended the provided array of middleware with dynamic one', () => {
      (configureStore as jest.Mock).mockReturnValue({});
      const { customMiddleware } = createMiddleware();
      configureGlobalStore({
        reducer: { root: (state = {}) => state },
        middleware: [customMiddleware],
      });
      const getDefaultMiddleware = jest.fn().mockReturnValue([]);

      const getMiddlewares = (configureStore as jest.Mock).mock.calls[0][0]
        .middleware;

      expect(getMiddlewares(getDefaultMiddleware)).toHaveLength(2);
    });

    it('should extended the provided func for middleware with dynamic one', () => {
      (configureStore as jest.Mock).mockReturnValue({});
      const { customMiddleware } = createMiddleware();
      configureGlobalStore({
        reducer: { root: (state = {}) => state },
        middleware: [customMiddleware],
      });
      const getDefaultMiddleware = jest.fn().mockReturnValue([]);
      const getMiddlewares = (configureStore as jest.Mock).mock.calls[0][0]
        .middleware;
      expect(getMiddlewares(getDefaultMiddleware)).toHaveLength(2);
    });

    it('should add default dynamic middleware', () => {
      (configureStore as jest.Mock).mockReturnValue({});
      configureGlobalStore({
        reducer: { root: (state = {}) => state },
      });
      const getDefaultMiddleware = jest.fn().mockReturnValue([]);
      const getMiddlewares = (configureStore as jest.Mock).mock.calls[0][0]
        .middleware;
      expect(getMiddlewares(getDefaultMiddleware)).toHaveLength(1);
    });

    it('should provide interface for reducer injection', () => {
      const replaceReducer = jest.fn();

      (configureStore as jest.Mock).mockReturnValue({
        replaceReducer,
      });

      const store = configureGlobalStore({
        reducer: { root: (state = {}) => state },
      });

      store.injectAsyncConfig?.({
        reducer: {
          test: (state = 'test') => state,
        },
      });

      expect(replaceReducer).toHaveBeenCalledTimes(1);
      expect(Object.keys(replaceReducer.mock.calls[0][0])).toHaveLength(2);
    });
  });

  describe('configureIsolatedStore', () => {
    test('should create the store', () => {
      configureIsolatedStore({
        reducer: {
          test: (state = 'test') => state,
        },
      });
      expect(configureStore as jest.Mock).toHaveBeenCalled();
    });
  });
});
