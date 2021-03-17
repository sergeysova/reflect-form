import { combine, createEvent, forward, Store } from 'effector';

import { FormField, FormFieldSet, InputField } from './types';

type Fields = (FormField | FormFieldSet)[];

interface BaseFieldSet extends Pick<InputField, 'name' | 'triggers' | 'isValid' | 'hasError'> {
  type: 'fieldset';
  value: any;
}

interface FieldConfig {
  name: string;
  fields: Fields;
}

const createBaseFieldSet = (config: FieldConfig): ((value: any) => BaseFieldSet) => {
  const validate = createEvent();

  forward({
    from: validate,
    to: config.fields.map((input) => input.triggers.validate),
  });

  const isValid = combine(
    config.fields.map((input) => input.isValid),
    (errors) => !errors.includes(false),
  );

  return (fn: (fields: any) => any) => {
    const { value, hasError } = fn(config.fields);

    return {
      name: config.name,
      value,
      hasError,
      type: 'fieldset',
      triggers: {
        validate,
      },
      isValid,
    };
  };
};

const getInputFieldSetValues = (fields: Fields) => {
  const values: { [key: string]: Store<any> } = {};

  const hasError = combine(
    fields.map((input) => input.hasError),
    (errors) => errors.includes(true),
  );

  fields.forEach((field) => {
    values[field.name] = field.value;
  });

  return {
    value: combine(values),
    hasError,
  };
};

const getCheckboxFieldSetValues = (fields: Fields) => {
  const values = fields.map((field) => field.value);
  const size = {
    min: 0,
    max: Number.MAX_SAFE_INTEGER,
  };

  const hasError = combine(values, (val) => val.length <= size.max && val.length >= size.min);

  return {
    value: combine(values, (list) => list.filter(Boolean)),
    hasError,
  };
};

export const createFieldSet = (config: FieldConfig) =>
  createBaseFieldSet(config)(getInputFieldSetValues);
export const createCheckBoxFieldSet = (config: FieldConfig) =>
  createBaseFieldSet(config)(getCheckboxFieldSetValues);
