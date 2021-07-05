import { combine, createStore, forward, Store } from 'effector';
import { getFieldsetValueAsArray, getFieldsetValueAsObject } from './getters';

import { FieldsetEntity, Fieldset, BaseField } from './types';

import { createTriggers } from './creators';

interface Config<T> {
  name: string;
  initialValue?: T | null;
}

export function createFieldsetEntity<T>({ name, initialValue }: Config<T>): FieldsetEntity {
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
}

export function createFieldset(
  name: string,
  fields: (Fieldset<{ [key: string]: Store<any> }> | BaseField<any>)[],
): Fieldset<{ [key: string]: Store<any> }> {
  const values = getFieldsetValueAsObject(fields);

  const fieldSet = createFieldsetEntity({ name, initialValue: combine(values) });

  forward({
    from: fieldSet.triggers.reset,
    to: fields.map((field) => field.triggers.reset),
  });

  return {
    ...fieldSet,
    value: combine(values),
  };
}

export function createList(
  name: string,
  fields: (Fieldset<any> | BaseField<any>)[],
): Fieldset<any> {
  const values = getFieldsetValueAsArray(fields);

  const fieldSet = createFieldsetEntity<any>({ name, initialValue: combine(values) });

  return {
    ...fieldSet,
    value: combine(values, (values) => values.filter((value) => value.length > 0)),
  };
}
