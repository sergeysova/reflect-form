// TODO create radioset
import { combine, Store } from 'effector';

import { createFieldset, getFieldSetValidation } from 'lib/createFieldset';
import { Field, FieldSet } from 'lib/types';

interface ListValidators {
  size: {
    min: number;
    max: number;
  };
}

interface ListSet extends FieldSet<any> {
  hasError: Store<boolean>;
}

const getFieldSetValueAsObject = (
  fields: (FieldSet<{ [key: string]: Store<any> }> | Field<any>)[],
) => {
  const values: { [key: string]: Store<any> } = {};

  fields.forEach((field) => {
    values[field.name] = field.value;
  });

  return values;
};

const getFieldSetValueAsArray = (fields: (FieldSet<any> | Field<any>)[]) =>
  fields.map((field) => field.value);

export const fieldSet = (
  name: string,
  fields: (FieldSet<{ [key: string]: Store<any> }> | Field<any>)[],
): FieldSet<{ [key: string]: Store<any> }> => {
  const values = getFieldSetValueAsObject(fields);
  const validation = getFieldSetValidation(fields);

  const fieldSet = createFieldset(name, combine(values), validation);

  return {
    ...fieldSet,
  };
};

export const listSet = (
  name: string,
  fields: (FieldSet<any> | Field<any>)[],
  validators?: ListValidators,
): ListSet => {
  const values = getFieldSetValueAsArray(fields);
  const validation = getFieldSetValidation(fields);

  const fieldSet = createFieldset(name, combine(values), validation);

  return {
    ...fieldSet,
    value: combine(values, (values) => values.filter((value) => value.length > 0)),
    hasError: combine(values, (values) => {
      const res = values.filter((value) => value.length > 0);

      if (!validators) return false;

      return res.length < validators.size.min || res.length >= validators.size.max;
    }),
  };
};
