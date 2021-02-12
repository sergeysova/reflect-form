import * as React from 'react';
import { createEvent, createStore, forward, guard, sample } from 'effector';
import { Field, FieldConfig } from './types';

// TODO add patronum debounce to field validation
export const createField = ({
  isRequired = false,
  validators = [],
  initialValue,
  name,
  validateOn = 'change',
  inputRequiredErrorText = 'Поле обязательно для заполнения',
  inputValuePattern,
}: FieldConfig): Field => {
  const $inputValue = createStore<string>(initialValue || '');
  const $inputIsTouched = createStore<boolean>(false);
  const $inputError = createStore<string | null>(null);
  const $hasError = $inputError.map((error) => error !== null);

  const createInputValidation = (value: string, touched: boolean) => ({
    isRequired: touched && isRequired && value.length === 0,
    hasValidator: touched && !!validators.length,
  });

  const checkPattern = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!inputValuePattern) return true;

    const valuePatterns = {
      letters: /^\w+$/,
      numbers: /^\d+$/,
    };

    const pattern = new RegExp(valuePatterns[inputValuePattern], 'giu');
    return pattern.test(e.target.value);
  };

  const onInputChanged = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Changed`);
  const onInputFocused = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Focused`);
  const onInputBlurred = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Blurred`);
  const onInputTouched = createEvent<void>(`${name}Touched`);
  const validate = createEvent();

  $inputValue.on(
    guard({
      source: onInputChanged,
      filter: (value) => checkPattern(value),
    }),
    (_, e) => e.currentTarget.value,
  );

  $inputIsTouched.on(onInputTouched, (touched) => {
    if (touched) return;
    return !touched;
  });

  forward({
    from: onInputFocused,
    to: onInputTouched,
  });

  forward({
    from: {
      change: onInputChanged,
      blur: onInputBlurred,
      focus: onInputFocused,
      formSubmit: createEvent(),
    }[validateOn],
    to: validate,
  });

  sample({
    source: [$inputValue, $inputIsTouched],
    clock: validate,
    fn: ([value, isTouched]) => {
      const validation = createInputValidation(value, isTouched);

      if (validation['isRequired']) return inputRequiredErrorText;

      if (validation['hasValidator']) {
        for (let i = 0; i < validators.length; i++) {
          if (validators[i](value)) return validators[i](value);
        }
        return null;
      }

      return null;
    },
    target: $inputError,
  });

  sample({
    source: $inputValue,
    clock: onInputBlurred,
  });

  return {
    name,
    type: 'field',
    value: $inputValue,
    isTouched: $inputIsTouched,
    error: $inputError,
    hasError: $hasError,
    triggers: {
      validate,
    },
    handlers: {
      onChange: onInputChanged,
      onFocus: onInputFocused,
      onBlur: onInputBlurred,
    },
  };
};
