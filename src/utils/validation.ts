import {
  MetadataStorage,
  ValidationOptions,
  ValidationTypes,
  ValidatorOptions,
  getFromContainer,
  validate,
  registerDecorator,
  ValidationArguments,
} from "class-validator";
import { ValidationMetadataArgs } from "class-validator/metadata/ValidationMetadataArgs";
import { ValidationMetadata } from "class-validator/metadata/ValidationMetadata";
import { ClassType } from "class-transformer/ClassTransformer";
import { plainToClass } from "class-transformer";

import { RequestValidationError } from "./errors";
import logger from "./logger";

const defaultValidatorOptions = { whitelist: true, groups: undefined };

export const transformToBoolean = (x: unknown) => {
  if (typeof x === "string") {
    const text = x.trim().toLowerCase();
    return text === "" ? undefined : text === "y" || text === "yes";
  }
  return x;
};

export async function transformToClass<T extends object>(
  classType: ClassType<T>,
  plain: T,
  options: ValidatorOptions = defaultValidatorOptions
): Promise<T> {
  try {
    const obj = plainToClass<T, T>(classType, plain);

    const errors = await validate(obj, {
      ...options,
      validationError: { target: false, value: false },
    });
    if (errors.length > 0) {
      throw new RequestValidationError(
        `TransformError: ${classType.name}`,
        errors
      );
    }
    return obj;
  } catch (e) {
    logger.error("Transform error", { error: e });
    throw e;
  }
}

export function transformToClassUnsafe<T extends object>(
  classType: ClassType<T>,
  plain: object,
  options: ValidatorOptions = defaultValidatorOptions
): Promise<T> {
  return transformToClass<T>(classType, plain as T, options);
}
/**
 * Checks if value is null and if so, ignores all validators.
 */
export function IsNullable(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.CONDITIONAL_VALIDATION,
      target: object.constructor,
      propertyName,
      constraints: [(obj: any, _val: any) => obj[propertyName] !== null],
      validationOptions,
    };
    getFromContainer(MetadataStorage).addValidationMetadata(
      new ValidationMetadata(args)
    );
  };
}

/**
 * Checks if value is undefined and if so, ignores all validators.
 */
export function IsUndefinable(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    const args: ValidationMetadataArgs = {
      type: ValidationTypes.CONDITIONAL_VALIDATION,
      target: object.constructor,
      propertyName,
      constraints: [(obj: any, _val: any) => obj[propertyName] !== undefined],
      validationOptions,
    };
    getFromContainer(MetadataStorage).addValidationMetadata(
      new ValidationMetadata(args)
    );
  };
}

/**
 * Checks if date is not from future
 */
export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: "isPastDateString",
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        defaultMessage(_args?: ValidationArguments) {
          return `${propertyName} must be past date`;
        },
        validate(value: any, _args?: ValidationArguments) {
          if (typeof value !== "string") {
            return false;
          }
          return new Date(value).getTime() < new Date().getTime();
        },
      },
    });
  };
}
