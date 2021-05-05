import { createEvent, createStore, forward } from 'effector';

import { Field, FieldConfig } from './types';

import { createEvents, createTriggers } from './helpers';

export const createField = <T>({
  name,
  initialValue,
  validateOn = 'change',
}: FieldConfig<T>): Field<T> => {
  const $initialValue = createStore<T>(initialValue as T);
  const $isTouched = createStore<boolean>(false);
  const $isValid = $initialValue.map((value) => Boolean(value));
  const $error = createStore<string | null>(null);
  const $hasError = $error.map((error) => error !== null);

  const { onChanged, onBlurred, onFocused, onTouched } = createEvents(name);
  const { onValidate, onForceValidate, onReset } = createTriggers(name);

  const valueSet = createEvent<T>();

  $initialValue.on(valueSet, (_, value) => value);

  $isTouched
    .on(onValidate, () => true)
    .on(onTouched, (touched) => {
      if (touched) return;
      return !touched;
    })
    .reset(onReset);

  forward({ from: onFocused, to: onTouched });
  forward({ from: onValidate, to: onForceValidate });
  forward({ from: valueSet, to: onValidate });

  forward({
    from: {
      change: onChanged,
      blur: onBlurred,
      focus: onFocused,
      formSubmit: createEvent(),
    }[validateOn],
    to: onForceValidate,
  });

  return {
    type: 'field',
    name,
    initialValue: $initialValue,
    isTouched: $isTouched,
    isValid: $isValid,
    hasError: $hasError,
    error: $error,
    handlers: {
      onChange: onChanged,
      onFocus: onFocused,
      onBlur: onBlurred,
    },
    triggers: {
      validate: onValidate,
      forceValidate: onForceValidate,
      reset: onReset,
      valueSet,
    },
  };
};
