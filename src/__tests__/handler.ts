import { IAPIRoute, ILambdaRequest } from './../types';
import { handler } from '../handler';
import * as routeHandler from '../routeHandler';

describe('handler', () => {
  const routes: IAPIRoute[] = [];
  const testHandler = handler(routes);
  const callback = jest.fn();
  const event: ILambdaRequest = {
    path: 'test',
    pathParameters: { proxy: 'test' },
    body: {},
    requestContext: { resourcePath: '/', httpMethod: 'get' },
  };
  test('should return on success', async () => {
    jest.spyOn(routeHandler, 'routeHandler').mockResolvedValue({
      statusCode: 200,
      body: 'success',
    });
    await testHandler(event, null, callback);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 200,
      body: 'success',
    });
  });

  test('should return 500 on error', async () => {
    jest
      .spyOn(routeHandler, 'routeHandler')
      .mockRejectedValue('error in request');
    await testHandler(event, null, callback);
    expect(callback).toHaveBeenCalledWith(null, {
      statusCode: 500,
      body: 'error in request',
    });
  });
});
