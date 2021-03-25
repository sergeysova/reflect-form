// Create custom fieldset based on fieldset
import { combine, Store } from 'effector';
import { createFieldset } from 'lib/createFieldset';
import { Field, FieldSet } from 'lib/types';

// all validators for fieldset
interface Validators {
  size: {
    min: number;
    max: number;
  };
}

interface CheckboxFieldset extends FieldSet {
  value: Store<any>;
  hasError: Store<boolean>;
}

export const checkboxFieldset = (
  name: string,
  fields: Field<any>[],
  validators: Validators,
): CheckboxFieldset => {
  const fieldset = createFieldset(name, fields, 'array');
  const values = fields.map((field) => field.value);

  return {
    ...fieldset,
    value: combine(values, (values) => values.filter((value) => value.length > 0)),
    hasError: combine(values, (values) => {
      const res = values.filter((value) => value.length > 0);
      return res.length < validators.size.min || res.length >= validators.size.max;
    }),
  };
};
