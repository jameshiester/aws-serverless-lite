import { IAPIRoute, ILambdaRequest } from './types';
import { routeHandler } from './routeHandler';

export const handler = (routes: IAPIRoute[]) => async (
  event: ILambdaRequest,
  _: any,
  callback: Function
): Promise<any> => {
  try {
    await routeHandler(event, routes, callback);
  } catch (e) {
    console.log(e);
    callback(null, {
      statusCode: 500,
      body: 'Unknown error occured',
    });
  }
};
