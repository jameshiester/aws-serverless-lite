# AWS SERVERLESS LITE

A simple library to manage routing in AWS lambda functions

## Example Usage

---

index.js

```javascript
import {
  handler as APIHandler,
  IAPIRoute,
  httpMethod,
} from 'aws-serverless-lite';

const routes: IAPIRoute[] = [
  {
    httpMethod: httpMethod.GET,
    path: 'projects',
    handlerFunction: getAll,
  },
  {
    httpMethod: httpMethod.GET,
    path: 'projects/:projectId',
    handlerFunction: ProjectService.update,
  },
];

exports.handler = async (event: any, _: any, callback: any) =>
  APIHandler(routes)(event, _, callback);
```

## License

---

This project is licensed under the MIT license.
