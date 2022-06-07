import { ValidatorOptions } from "class-validator";
import { ClassType } from "class-transformer/ClassTransformer";
import { transformToClassUnsafe } from "ntbs/utils/validation";

export const toRequired =
  <T extends object>(classType: ClassType<T>, options?: ValidatorOptions) =>
  (row: object) =>
    transformToClassUnsafe(classType, row, options);

export const toOptional =
  <T extends object>(classType: ClassType<T>, options?: ValidatorOptions) =>
  (row: object | null) =>
    row ? transformToClassUnsafe(classType, row, options) : null;

export const toMany =
  <T extends object>(classType: ClassType<T>, options?: ValidatorOptions) =>
  (result: object[]): Promise<T[]> =>
    Promise.all(
      result.map(row => transformToClassUnsafe(classType, row, options))
    );
