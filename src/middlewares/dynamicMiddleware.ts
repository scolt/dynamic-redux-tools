import {
  AnyAction,
  compose,
  Dispatch,
  Middleware,
  MiddlewareAPI,
} from '@reduxjs/toolkit';

export const createDynamicMiddleware = () => {
  let internalMiddlewareAPI: MiddlewareAPI;
  let internalDispatch: Dispatch;
  let middlewares: Middleware[] = [];

  const middleware = (store: MiddlewareAPI) => (next: Dispatch) => {
    internalMiddlewareAPI = store;
    internalDispatch = next;

    return (action: AnyAction) => {
      return compose(...middlewares, internalDispatch)(action);
    };
  };

  const addMiddlewares = (newMiddlewares: Middleware[]) => {
    const linkedMiddlewares = newMiddlewares.map((middleware) =>
      middleware(internalMiddlewareAPI)(internalDispatch)
    );
    middlewares = middlewares.concat(linkedMiddlewares);
  };

  return {
    middleware,
    addMiddlewares,
  };
};
