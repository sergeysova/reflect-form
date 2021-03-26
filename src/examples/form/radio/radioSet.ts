import { Store } from 'effector';

import { createFieldset } from 'lib/createFieldset';
import { Field, FieldSet } from 'lib/types';
import { RadioField } from './field';

interface RadioSet {
  value: Store<string>;
}

export const radioSet = (name: string, fields: RadioField[]) => {
  const fieldSet = createFieldset(name, 'object', fields);
};
