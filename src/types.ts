export enum httpMethod {
  CONNECT = 'connect',
  DELETE = 'delete',
  GET = 'get',
  HEAD = 'head',
  OPTIONS = 'options',
  PATCH = 'patch',
  POST = 'post',
  PUT = 'put',
  TRACE = 'trace',
}

export interface IAPIRoute {
  handlerFunction: (req: any, callback: any) => Promise<void>;
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
