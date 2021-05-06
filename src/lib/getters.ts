import { Store } from 'effector';
import { BaseField, Fieldset } from './types';

export function getFieldsetValueAsArray(fields: (Fieldset<any> | BaseField<any>)[]) {
  return fields.map((field) => field.value);
}

export function getFieldsetValueAsObject(
  fields: (Fieldset<{ [key: string]: Store<any> }> | BaseField<any>)[],
) {
  const values: { [key: string]: Store<any> } = {};

  fields.forEach((field) => {
    values[field.name] = field.value;
  });

  return values;
}
