import { combine, createEvent, forward, Store } from 'effector';

import { Field, FieldSet } from './types';

export const createFieldset = (name: string, fields: (Field | FieldSet)[]): FieldSet => {
  const values: { [key: string]: Store<any> } = {};
  const validate = createEvent();

  const inputsErrors = fields.map((input) => input.hasError);
  const inputsValid = fields.map((input) => input.isValid);
  const inputsValidators = fields.map((input) => input.triggers.validate);

  const hasError = combine(inputsErrors, (errors) => errors.includes(true));
  const isValid = combine(inputsValid, (errors) => !errors.includes(false));

  forward({
    from: validate,
    to: inputsValidators,
  });

  fields.forEach((field) => {
    values[field.name] = field.value;
  });

  return {
    name,
    type: 'fieldset',
    value: combine(values),
    hasError,
    triggers: {
      validate,
    },
    isValid,
  };
};
