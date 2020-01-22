import { get } from 'lodash';
import { IAPIRoute, ILambdaRequest } from './types';
import { forbidden } from '.';

const ROUTE_PARAM_PREFIX = ':';
const PATH_SEPARATOR = '/';

export const isPartMatch = (reqPart: string, routePart: string) => {
  return (
    routePart &&
    (routePart.startsWith(ROUTE_PARAM_PREFIX) || reqPart === routePart)
  );
};

export const getRouteParams = (
  routeParts: string[],
  requestRouteParts: string[]
) =>
  routeParts.reduce((acc: any, part: string, index) => {
    if (part.startsWith(ROUTE_PARAM_PREFIX) && part.length > 0) {
      acc[part.replace(ROUTE_PARAM_PREFIX, '')] = requestRouteParts[index];
    }
    return acc;
  }, {});

export const isRouteMatch = (
  route: IAPIRoute,
  request: ILambdaRequest
): boolean => {
  const requestRouteParts = get(request, 'pathParameters.proxy', '').split(
    PATH_SEPARATOR
  );
  const routeParts = route.path.split(PATH_SEPARATOR);
  if (requestRouteParts.length != routeParts.length) return false;
  request.routeParameters = getRouteParams(routeParts, requestRouteParts);
  return (
    request.requestContext.httpMethod === route.httpMethod &&
    requestRouteParts.every((part: string, index: number) =>
      isPartMatch(part, routeParts[index])
    )
  );
};

const hasRequiredScopes = (
  request: ILambdaRequest,
  requiredScopes: string[] = []
): boolean => {
  const userScopes = get(request, 'requestContext.authorizer.scope', '').split(
    ' '
  );
  return (
    !requiredScopes.length ||
    requiredScopes.every((scope: string) =>
      userScopes.find((w: string) => w === scope)
    )
  );
};

export const routeHandler = async (
  req: ILambdaRequest,
  routes: IAPIRoute[]
) => {
  try {
    const reqRoute = routes.find(route => isRouteMatch(route, req));
    if (reqRoute && hasRequiredScopes(req, reqRoute.requiredScopes)) {
      return await reqRoute.handlerFunction(req);
    } else {
      return forbidden;
    }
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: err,
    };
  }
};
