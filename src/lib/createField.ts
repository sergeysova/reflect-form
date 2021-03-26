import { ChangeEvent } from 'react';
import { createEvent, createStore, forward, sample } from 'effector';
import { Field, FieldConfig, FieldEvents, FieldTriggers } from './types';

const createFieldEvents = (name: string): FieldEvents => {
  const onChanged = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Changed`);
  const onFocused = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Focused`);
  const onBlurred = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Blurred`);
  const onTouched = createEvent<void>(`${name}Touched`);

  return {
    onChanged,
    onFocused,
    onBlurred,
    onTouched,
  };
};

const createFiledTriggers = (name: string): FieldTriggers => {
  const onValidate = createEvent<void>(`${name}ValidationTriggered`);
  const onForceValidate = createEvent<void>(`${name}ForceValidationTriggered`);
  const onReset = createEvent<void>(`${name}Reset`);

  return {
    onValidate,
    onForceValidate,
    onReset,
  };
};

export const createField = <T>({
  name,
  value,
  validateOn = 'change',
}: FieldConfig<T>): Field<T> => {
  const $value = createStore<T>(value);
  const $isTouched = createStore<boolean>(false);
  const $error = createStore<string | null>(null);
  const $hasError = $error.map((error) => error !== null);
  const $isValid = $value.map((value) => Boolean(value));

  const { onChanged, onBlurred, onFocused, onTouched } = createFieldEvents(name);
  const { onValidate, onForceValidate, onReset } = createFiledTriggers(name);

  const valueSet = createEvent<T>();

  $value.on(valueSet, (_, value) => value);

  $isTouched
    .on(onValidate, () => true)
    .on(onTouched, (touched) => {
      if (touched) return;
      return !touched;
    })
    .reset(onReset);

  $error.reset(onReset);

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

  sample({ source: $value, clock: onBlurred });

  return {
    type: 'field',
    name,
    value: $value,
    error: $error,
    isTouched: $isTouched,
    hasError: $hasError,
    isValid: $isValid,
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
