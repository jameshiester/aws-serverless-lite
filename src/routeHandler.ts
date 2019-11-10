import { get } from 'lodash';
import { IAPIRoute, ILambdaRequest } from './types';

const isPartMatch = (reqPart: string, routePart: string) => {
  return routePart.startsWith(':') || reqPart === routePart;
};

const isRouteMatch = (route: any, req: ILambdaRequest): boolean => {
  const requestRouteParts = get(req, 'pathParameters.proxy', '').split('/');
  const routeParts = route.path.split('/');
  return (
    req.requestContext.httpMethod === route.httpMethod &&
    requestRouteParts.every((part: string, index: number) =>
      isPartMatch(part, routeParts[index])
    )
  );
};

export const routeHandler = async (
  req: ILambdaRequest,
  routes: IAPIRoute[],
  callback: Function
) => {
  const reqRoute = routes.find(route => isRouteMatch(route, req));
  if (reqRoute) {
    await reqRoute.handlerFunction(req, callback);
  } else {
    callback(null, {
      statusCode: 403,
      body: 'Forbidden',
    });
  }
};
