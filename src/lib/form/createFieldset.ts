import { combine, Store } from 'effector';

import { Field, FieldSet } from './types';

export const createFieldset = (name: string, fields: (Field | FieldSet)[]): FieldSet => {
  let values: { [key: string]: Store<any> } = {};

  const inputsErrors = fields.map((input) => input.hasError);

  const hasError = combine(inputsErrors, (errors) => errors.includes(true));

  fields.forEach((field) => (values[field.name] = field.value));

  return {
    name,
    type: 'fieldset',
    value: combine(values),
    hasError,
  };
};
