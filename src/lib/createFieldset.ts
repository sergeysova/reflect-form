import { combine, createStore, forward, Store } from 'effector';

import { FieldSetEntity, FieldSet, BaseField } from './types';

import { createTriggers, getFieldSetValueAsArray, getFieldSetValueAsObject } from './helpers';

interface Config<T> {
  name: string;
  initialValue?: T | null;
}

const createFieldset = <T>({ name, initialValue }: Config<T>): FieldSetEntity => {
  const $initialValue = createStore<T | null>(initialValue || null);

  const { onValidate, onForceValidate, onReset, onValueSet } = createTriggers(name);

  return {
    type: 'fieldset',
    name,
    initialValue: $initialValue,
    triggers: {
      validate: onValidate,
      forceValidate: onForceValidate,
      reset: onReset,
      valueSet: onValueSet,
    },
  };
};

export const fieldSet = (
  name: string,
  fields: (FieldSet<{ [key: string]: Store<any> }> | BaseField<any>)[],
): FieldSet<{ [key: string]: Store<any> }> => {
  const values = getFieldSetValueAsObject(fields);

  const fieldSet = createFieldset({ name, initialValue: combine(values) });

  forward({
    from: fieldSet.triggers.reset,
    to: fields.map((field) => field.triggers.reset),
  });

  return {
    ...fieldSet,
    value: combine(values),
  };
};

export const listSet = (
  name: string,
  fields: (FieldSet<any> | BaseField<any>)[],
): FieldSet<any> => {
  const values = getFieldSetValueAsArray(fields);

  const fieldSet = createFieldset<any>({ name, initialValue: combine(values) });

  return {
    ...fieldSet,
    value: combine(values, (values) => values.filter((value) => value.length > 0)),
  };
};
