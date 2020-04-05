import { IRouteResponse } from './types';

export const forbidden: IRouteResponse = {
  statusCode: 403,
  body: 'Forbidden',
};

export const notFound: IRouteResponse = {
  statusCode: 404,
  body: 'Not Found',
};

export const ok = (data: any): IRouteResponse => ({
  statusCode: 200,
  body: JSON.stringify(data),
});

export const badRequest = (
  data: any,
  statusCode: number = 400
): IRouteResponse => ({
  statusCode,
  body: JSON.stringify(data),
});
