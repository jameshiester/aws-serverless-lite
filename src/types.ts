export enum httpMethod {
  CONNECT = 'CONNECT',
  DELETE = 'DELETE',
  GET = 'GET',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
  PATCH = 'PATCH',
  POST = 'POST',
  PUT = 'PUT',
  TRACE = 'TRACE',
}

export interface IRouteResponse {
  statusCode: number;
  body: string;
  isBase64Encoded?: boolean;
  headers?: any;
}

export interface IAPIRoute {
  handlerFunction: (req: any) => Promise<IRouteResponse>;
  httpMethod: httpMethod;
  path: string;
  requiredScopes?: string[];
}

export interface ILambdaRequest {
  path: string;
  pathParameters: any;
  routeParameters?: any;
  requestContext: {
    resourcePath: string;
    httpMethod: string;
    authorizer: any;
  };
  body?: any;
}
