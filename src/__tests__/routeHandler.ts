import { ILambdaRequest, IAPIRoute, httpMethod } from '../types';
import { getRouteParams, routeHandler } from '../routeHandler';

describe('getRouteParams', () => {
  test('should get a route param', () => {
    const routeParts: string[] = ['a', ':b'];
    const requestRouteParts: string[] = ['a', 'testId'];
    const result = getRouteParams(routeParts, requestRouteParts);
    expect(result).toEqual({
      b: 'testId',
    });
  });
  test('should get multiple route params', () => {
    const routeParts: string[] = ['a', ':b', ':c'];
    const requestRouteParts: string[] = ['a', 'testId', 'testId2'];
    const result = getRouteParams(routeParts, requestRouteParts);
    expect(result).toEqual({
      b: 'testId',
      c: 'testId2',
    });
  });
});

describe('getRouteParams', () => {
  test('should call route if found', async () => {
    const routes: IAPIRoute[] = [
      {
        handlerFunction: jest.fn().mockResolvedValue({ success: true }),
        httpMethod: httpMethod.GET,
        path: 'a/:b',
      },
    ];
    const request: ILambdaRequest = {
      path: 'testService/',
      pathParameters: {
        proxy: 'a/testId',
      },
      requestContext: {
        resourcePath: 'any',
        httpMethod: httpMethod.GET,
      },
    };
    const result = await routeHandler(request, routes);
    expect(routes[0].handlerFunction).toHaveBeenCalledTimes(1);
    expect(routes[0].handlerFunction).toHaveBeenCalledWith({
      ...request,
      routeParameters: {
        b: 'testId',
      },
    });
    expect(result).toEqual({ success: true });
  });

  test('should not call route if wrong method', async () => {
    const routes: IAPIRoute[] = [
      {
        handlerFunction: jest.fn().mockResolvedValue({ success: true }),
        httpMethod: httpMethod.POST,
        path: 'a/:b',
      },
    ];
    const request: ILambdaRequest = {
      path: 'testService/',
      pathParameters: {
        proxy: 'a/testId',
      },
      requestContext: {
        resourcePath: 'any',
        httpMethod: httpMethod.GET,
      },
    };
    const result = await routeHandler(request, routes);
    expect(routes[0].handlerFunction).not.toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 403,
      body: 'Forbidden',
    });
  });

  test('should not call route if route mismatch', async () => {
    const routes: IAPIRoute[] = [
      {
        handlerFunction: jest.fn().mockResolvedValue({ success: true }),
        httpMethod: httpMethod.GET,
        path: 'a/b',
      },
    ];
    const request: ILambdaRequest = {
      path: 'testService/',
      pathParameters: {
        proxy: 'a/c',
      },
      requestContext: {
        resourcePath: 'any',
        httpMethod: httpMethod.GET,
      },
    };
    const result = await routeHandler(request, routes);
    expect(routes[0].handlerFunction).not.toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 403,
      body: 'Forbidden',
    });
  });

  test('should not call route if route mismatch because route path has more parts', async () => {
    const routes: IAPIRoute[] = [
      {
        handlerFunction: jest.fn(),
        httpMethod: httpMethod.GET,
        path: 'a/b/c',
      },
    ];
    const request: ILambdaRequest = {
      path: 'testService/',
      pathParameters: {
        proxy: 'a/b',
      },
      requestContext: {
        resourcePath: 'any',
        httpMethod: httpMethod.GET,
      },
    };
    const result = await routeHandler(request, routes);
    expect(routes[0].handlerFunction).not.toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 403,
      body: 'Forbidden',
    });
  });

  test('should not call route if route mismatch because request path has more parts', async () => {
    const routes: IAPIRoute[] = [
      {
        handlerFunction: jest.fn(),
        httpMethod: httpMethod.GET,
        path: 'a/b',
      },
    ];
    const request: ILambdaRequest = {
      path: 'testService/',
      pathParameters: {
        proxy: 'a/b/c',
      },
      requestContext: {
        resourcePath: 'any',
        httpMethod: httpMethod.GET,
      },
    };
    const result = await routeHandler(request, routes);
    expect(routes[0].handlerFunction).not.toHaveBeenCalled();
    expect(result).toEqual({
      statusCode: 403,
      body: 'Forbidden',
    });
  });

  test('should catch error and return 500', async () => {
    const routes: IAPIRoute[] = [
      {
        handlerFunction: jest.fn().mockRejectedValue('internal exception'),
        httpMethod: httpMethod.GET,
        path: 'a/:b',
      },
    ];
    const request: ILambdaRequest = {
      path: 'testService/',
      pathParameters: {
        proxy: 'a/testId',
      },
      requestContext: {
        resourcePath: 'any',
        httpMethod: httpMethod.GET,
      },
    };
    const result = await routeHandler(request, routes);
    expect(routes[0].handlerFunction).toHaveBeenCalledTimes(1);
    expect(routes[0].handlerFunction).toHaveBeenCalledWith({
      ...request,
      routeParameters: {
        b: 'testId',
      },
    });
    expect(result).toEqual({
      statusCode: 500,
      body: 'internal exception',
    });
  });
});
