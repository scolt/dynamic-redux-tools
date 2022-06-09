export const createMiddleware = () => {
  const actionMiddlewareFn = jest.fn();
  const nextMiddlewareFn = jest.fn().mockReturnValue(actionMiddlewareFn);
  const customMiddleware = jest.fn().mockReturnValue(nextMiddlewareFn);

  return {
    actionMiddlewareFn,
    nextMiddlewareFn,
    customMiddleware,
  };
};
