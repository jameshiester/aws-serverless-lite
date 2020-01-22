import { IRouteResponse } from './types';

export const forbidden: IRouteResponse = {
  statusCode: 403,
  body: 'Forbidden',
};

export const ok = (data: any): IRouteResponse => ({
  statusCode: 200,
  body: JSON.stringify(data),
});
