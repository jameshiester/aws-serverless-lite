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
}

export interface IAPIRoute {
  handlerFunction: (req: any) => Promise<IRouteResponse>;
  httpMethod: httpMethod;
  path: string;
}

export interface ILambdaRequest {
  path: string;
  pathParameters: any;
  requestContext: {
    resourcePath: string;
    httpMethod: string;
  };
  body: any;
}
