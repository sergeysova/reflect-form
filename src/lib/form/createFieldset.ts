import { combine, createEvent, forward, Store, Event } from 'effector';
import { Field } from './createField';

type FieldSetType = 'object' | 'array';

type FieldSetValues = { [key: string]: Store<any> } | Store<any>[];

interface FieldSet {
  name: string;
  type: 'fieldset';
  value: Store<FieldSetValues>;
  triggers: {
    validate: Event<void>;
  };
  isValid: Store<boolean>;
}

const getFieldSetValidation = (fields: (FieldSet | Field<any>)[]) => {
  const validate = createEvent();

  forward({
    from: validate,
    to: fields.map((field) => field.triggers.validate),
  });

  // TODO research cases when boolean checkbox defaults to true
  // TODO look for cases to create checkbox isValid inside component
  const isValid = combine(
    fields.map((field) => field.isValid),
    (errors) => !errors.includes(true),
  );

  return { validate, isValid };
};

const getFieldSetValues = (
  type: FieldSetType,
  fields: (FieldSet | Field<any>)[],
): FieldSetValues => {
  if (type === 'array') {
    return fields.map((field) => field.value);
  }

  const values: { [key: string]: Store<any> } = {};

  fields.forEach((field) => {
    values[field.name] = field.value;
  });

  return values;
};

export const createFieldset = (
  name: string,
  type: FieldSetType,
  fields: (Field<any> | FieldSet)[],
): FieldSet => {
  const values = getFieldSetValues(type, fields);
  const { validate, isValid } = getFieldSetValidation(fields);

  return {
    name,
    type: 'fieldset',
    value: combine(values),
    triggers: {
      validate,
    },
    isValid,
  };
};
