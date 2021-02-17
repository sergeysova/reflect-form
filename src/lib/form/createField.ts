import * as React from 'react';
import { createEvent, createStore, forward, guard, sample } from 'effector';
import { Field, FieldConfig, FieldValuePatten } from './types';

const checkFieldPattern = (
  e: React.ChangeEvent<HTMLInputElement>,
  fieldValuePattern: FieldValuePatten | undefined,
) => {
  if (!fieldValuePattern) return true;

  const valuePatterns = {
    letters: /^\w+$/,
    numbers: /^\d+$/,
  };

  const pattern = new RegExp(valuePatterns[fieldValuePattern], 'giu');
  return pattern.test(e.target.value);
};

// TODO add patronum debounce to field validation
export const createField = ({
  isRequired = false,
  validators = [],
  defaultValue,
  name,
  validateOn = 'change',
  fieldRequiredErrorText = 'Поле обязательно для заполнения',
  fieldValuePattern,
}: FieldConfig): Field => {
  const $fieldValue = createStore<string>(defaultValue || '');
  const $fieldIsTouched = createStore<boolean>(false);
  const $fieldError = createStore<string | null>(null);
  const $hasError = $fieldError.map((error) => error !== null);

  const createFieldValidation = (value: string, touched: boolean) => ({
    isRequired: touched && isRequired && value.length === 0,
    hasValidator: touched && Boolean(validators.length),
  });

  const onFieldChanged = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Changed`);
  const onFieldFocused = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Focused`);
  const onFieldBlurred = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Blurred`);
  const onFieldTouched = createEvent<void>(`${name}Touched`);
  const validate = createEvent();

  $fieldValue.on(
    guard({
      source: onFieldChanged,
      filter: (value) => checkFieldPattern(value, fieldValuePattern),
    }),
    (_, e) => e.currentTarget.value,
  );

  $fieldIsTouched.on(onFieldTouched, (touched) => {
    if (touched) return;
    return !touched;
  });

  forward({
    from: onFieldFocused,
    to: onFieldTouched,
  });

  forward({
    from: {
      change: onFieldChanged,
      blur: onFieldBlurred,
      focus: onFieldFocused,
      formSubmit: createEvent(),
    }[validateOn],
    to: validate,
  });

  sample({
    source: [$fieldValue, $fieldIsTouched],
    clock: validate,
    fn: ([value, isTouched]) => {
      const validation = createFieldValidation(value, isTouched);

      if (validation.isRequired) return fieldRequiredErrorText;

      if (validation.hasValidator) {
        for (const element of validators) {
          if (element(value)) return element(value);
        }
        return null;
      }

      return null;
    },
    target: $fieldError,
  });

  sample({
    source: $fieldValue,
    clock: onFieldBlurred,
  });

  return {
    name,
    type: 'field',
    value: $fieldValue,
    isTouched: $fieldIsTouched,
    isRequired,
    error: $fieldError,
    hasError: $hasError,
    triggers: {
      validate,
    },
    handlers: {
      onChange: onFieldChanged,
      onFocus: onFieldFocused,
      onBlur: onFieldBlurred,
    },
  };
};
