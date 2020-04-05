import { Either, failure, success } from './types';
import {
  ValidationError,
  StringSchema,
  Schema,
  ObjectSchema,
  MixedSchema,
} from 'yup';

interface ModelValidationError {
  key: string | any;
  errors: string[];
}

const mapErrors = (err: ValidationError): ModelValidationError[] => {
  return err.inner
    ? err.inner.map(error => ({
        key: error.path || error.type,
        errors: error.errors,
      }))
    : [];
};

export const validateSchema = async (
  schema:
    | Schema<any>
    | StringSchema<any>
    | ObjectSchema<any>
    | MixedSchema<any>,
  entity: any
): Promise<Either<ModelValidationError[], any>> => {
  let validationErrors: ModelValidationError[] = [];
  await schema
    .validate(entity, { abortEarly: false })
    .catch((err: ValidationError) => (validationErrors = mapErrors(err)));
  return validationErrors.length ? failure(validationErrors) : success(entity);
};
