import { IAPIRoute, ILambdaRequest, IRouteResponse } from './types';
import { routeHandler } from './routeHandler';

export const handler = (routes: IAPIRoute[]) => async (
  event: ILambdaRequest,
  _: any,
  callback: Function
): Promise<any> => {
  return routeHandler(event, routes)
    .then((data: IRouteResponse) => callback(null, data))
    .catch((err: string) =>
      callback(null, {
        statusCode: 500,
        body: err,
      })
    );
};
