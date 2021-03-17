import { combine, createEvent, forward, Store } from 'effector';

import { CheckboxField, BaseFieldSet, FormField, FormFieldSet, FieldSetValues } from './types';

const createBaseFieldSet = <T>(
  name: string,
  fields: (FormField | FormFieldSet)[],
  hasError: Store<boolean>,
  values: FieldSetValues,
): BaseFieldSet<T> => {
  const validate = createEvent();

  forward({
    from: validate,
    to: fields.map((input) => input.triggers.validate),
  });

  const isValid = combine(
    fields.map((input) => input.isValid),
    (errors) => !errors.includes(false),
  );

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

export const createFieldset = (
  name: string,
  fields: (FormField | FormFieldSet)[],
): BaseFieldSet<InputFieldSetValue> => {
  const values: { [key: string]: Store<any> } = {};

  const hasError = combine(
    fields.map((input) => input.hasError),
    (errors) => errors.includes(true),
  );

  fields.forEach((field) => {
    values[field.name] = field.value;
  });

  return createBaseFieldSet(name, fields, hasError, values);
};

export const createCheckboxSet = (
  name: string,
  fields: CheckboxField<string>[],
  size = {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  },
): BaseFieldSet => {
  const values = fields.map((field) => field.value);

  const hasError = combine(
    values,
    (values) => values.length <= size.max && values.length >= size.min,
  );

  return createBaseFieldSet(name, fields, hasError, values);
};

