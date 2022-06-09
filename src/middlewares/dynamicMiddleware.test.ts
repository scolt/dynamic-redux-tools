import { createDynamicMiddleware } from './dynamicMiddleware';
import { Dispatch, Store } from '@reduxjs/toolkit';
import { createMiddleware } from '../tests.utils';

describe('asyncMiddleware.ts', () => {
  it('should provide interface for adding middleware', () => {
    const middleware = createDynamicMiddleware();
    expect(middleware.addMiddlewares).toBeDefined();
  });

  it('should call middlewares which was added asynchronously', () => {
    const middleware = createDynamicMiddleware();

    const firstMiddlewareAction = jest.fn();
    const secondMiddlewareAction = jest.fn();

    const firstMiddleware = jest
      .fn()
      .mockReturnValue(jest.fn().mockReturnValue(firstMiddlewareAction));
    const secondMiddleware = jest
      .fn()
      .mockReturnValue(jest.fn().mockReturnValue(secondMiddlewareAction));

    const store = {} as Store;
    const next = jest.fn() as Dispatch;
    const action = {
      type: 'POSSIBLE_ACTION',
    };

    middleware.addMiddlewares([firstMiddleware]);
    middleware.addMiddlewares([secondMiddleware]);
    middleware.middleware(store)(next)(action);

    expect(firstMiddlewareAction).toHaveBeenCalledTimes(1);
    expect(secondMiddlewareAction).toHaveBeenCalledTimes(1);
  });

  it('should link store and next functions once', () => {
    const middlewareInstance = createDynamicMiddleware();
    const { customMiddleware, nextMiddlewareFn, actionMiddlewareFn } =
      createMiddleware();

    const store = {} as Store;
    const next = jest.fn() as Dispatch;
    const action = {
      type: 'POSSIBLE_ACTION',
    };

    const middleware = middlewareInstance.middleware(store)(next);
    middlewareInstance.addMiddlewares([customMiddleware]);

    middleware(action);
    middleware(action);

    expect(customMiddleware).toHaveBeenCalledTimes(1);
    expect(nextMiddlewareFn).toHaveBeenCalledTimes(1);
    expect(actionMiddlewareFn).toHaveBeenCalledTimes(2);
  });
});
