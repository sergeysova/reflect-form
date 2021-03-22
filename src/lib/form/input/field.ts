import { ChangeEvent } from 'react';
import { guard, sample } from 'effector';

import { Field, FieldValuePatten, InputFieldConfig } from '../types';
import { createField } from '../createField';

const checkFieldPattern = (
  e: ChangeEvent<HTMLInputElement>,
  valuePattern: FieldValuePatten | undefined,
) => {
  if (!valuePattern) return true;

  const valuePatterns = {
    letters: /^\w+$/,
    numbers: /^\d+$/,
  };

  const pattern = new RegExp(valuePatterns[valuePattern], 'giu');
  return pattern.test(e.target.value);
};

export const inputTextField = ({
  name,
  fieldValue = '',
  isRequired = false,
  validators = [],
  requiredErrorText = 'Поле обязательно для заполнения',
  validateOn,
  valuePattern,
  valueAs,
}: InputFieldConfig<string | number>): Field<string | number> => {
  const { type, value, isTouched, isValid, error, hasError, triggers, handlers } = createField<
    string | number
  >({
    name,
    value: fieldValue,
    validateOn,
  });

  value.on(
    guard({
      source: handlers.onChange,
      filter: (value) => checkFieldPattern(value, valuePattern),
    }),
    (_, e) => {
      if (valueAs === 'number') return Number.parseInt(e.currentTarget.value, 10) || '';
      return e.currentTarget.value;
    },
  );

  sample({
    source: [value, isTouched],
    clock: triggers.forceValidate,
    fn: ([value, isTouched]) => {
      if (isTouched && isRequired && `${value}`.length === 0) return requiredErrorText;

      if (isTouched && Boolean(validators.length)) {
        for (const element of validators) {
          if (element(value)) return element(value);
        }
        return null;
      }

      return null;
    },
    target: error,
  });

  return {
    type,
    name,
    value,
    isTouched,
    isRequired,
    isValid,
    error,
    hasError,
    triggers: {
      ...triggers,
    },
    handlers: {
      ...handlers,
    },
  };
};
