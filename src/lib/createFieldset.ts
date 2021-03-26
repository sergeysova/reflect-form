import { combine, createEvent, Event, forward, Store } from 'effector';
import { FieldSet } from './types';

interface Validation {
  validate: Event<void>;
  isValid: Store<boolean>;
}

// TODO fix typings
export const getFieldSetValidation = (fields: any[]): Validation => {
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

export const createFieldset = <T>(
  name: string,
  value: Store<T>,
  validation: Validation,
): FieldSet<T> => ({
  name,
  type: 'fieldset',
  value,
  triggers: {
    validate: validation.validate,
  },
  isValid: validation.isValid,
});
