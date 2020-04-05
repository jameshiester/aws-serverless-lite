import { Schema, StringSchema, ObjectSchema, MixedSchema } from 'yup';

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
  handlerFunction: (req: any) => Promise<IRouteResponse> | IRouteResponse;
  httpMethod: httpMethod;
  path: string;
  requiredScopes?: string[];
  schema?:
    | Schema<any>
    | StringSchema<any>
    | ObjectSchema<any>
    | MixedSchema<any>;
  parseBody?: boolean;
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
  queryStringParameters: any;
  multiValueQueryStringParameters: any;
  body?: any;
}

export type Either<L, A> = Failure<L, A> | Success<L, A>;

export class Failure<L, A> {
  readonly value: L;
  constructor(value: L) {
    this.value = value;
  }

  proceed<B>(_: (a: A) => B): Either<L, B> {
    return this as any;
  }

  isFailure(): this is Failure<L, A> {
    return true;
  }
  isSuccess(): this is Success<L, A> {
    return false;
  }
}

export class Success<L, A> {
  readonly value: A;
  constructor(value: A) {
    this.value = value;
  }
  isFailure(): this is Failure<L, A> {
    return false;
  }
  isSuccess(): this is Success<L, A> {
    return true;
  }
}

export const failure = <L, A>(l: L): Either<L, A> => {
  return new Failure(l);
};

export const success = <L, A>(a: A): Either<L, A> => {
  return new Success<L, A>(a);
};
