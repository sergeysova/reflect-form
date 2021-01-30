import * as React from 'react';
import { createEvent, createEffect, createStore, forward, sample, combine, guard } from 'effector';
import { pending } from 'patronum/pending';
import { Field, FieldConfig, FieldValidatorParams } from './types';

// TODO add patronum debounce to field validation
export const createField = ({
  isRequired = false,
  validators = [],
  initialValue,
  name,
  validateOn = 'change',
  inputRequiredErrorText = 'Поле обязательно для заполнения',
}: FieldConfig): Field => {
  const $inputValue = createStore<string>(initialValue || '');
  const $inputIsTouched = createStore<boolean>(false);
  const $inputError = createStore<any | null>(null);
  const $hasError = $inputError.map((error) => error !== null);

  const onInputChanged = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Changed`);
  const onInputFocused = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Focused`);
  const onInputBlurred = createEvent<React.ChangeEvent<HTMLInputElement>>(`${name}Blurred`);
  const onInputTouched = createEvent<void>(`${name}Touched`);
  const validate = createEvent();

  $inputValue.on(onInputChanged, (_, e) => e.currentTarget.value);
  $inputIsTouched.on(onInputTouched, (touched) => {
    if (touched) return;
    return !touched;
  });
  $inputError.reset(validate);

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

  const $fieldMeta = combine({ name, value: $inputValue, touched: $inputIsTouched, error: $inputError });

  const requiredFx = createEffect<FieldValidatorParams, null, string>(({ value }) => !isRequired || (value && value.length > 0) ? Promise.resolve(null) : Promise.reject(inputRequiredErrorText));

  forward({
    from: requiredFx.failData,
    to: $inputError,
  });

  const kick = sample({
    source: $fieldMeta,
    clock: validate,
  });

  // kickstart validation
  guard({
    source: kick,
    filter: ({ touched }) => touched,
    target: requiredFx,
  });

  if (Boolean(validators.length)) {
    sample({
      source: $fieldMeta,
      clock: requiredFx.done,
      target: validators[0],
    });

    forward({
      from: validators[0].failData,
      to: $inputError,
    });

    for (let i = 1; i < validators.length; i++) {
    // failed effect stops validation and fills the error store
      forward({
        from: validators[i].failData,
        to: $inputError,
      });

    // successfull validation effect triggers the next one
      sample({
        source: $fieldMeta,
        clock: validators[i - 1].done,
        target: validators[i],
      });
    }
  }

  sample({
    source: $inputValue,
    clock: onInputBlurred,
  });

  const $validationPending = pending({ effects: [requiredFx, ...validators] });

  return {
    name,
    type: 'field',
    value: $inputValue,
    isTouched: $inputIsTouched,
    error: $inputError,
    hasError: $hasError,
    validationPending: $validationPending,
    handlers: {
      onChange: onInputChanged,
      onFocus: onInputFocused,
      onBlur: onInputBlurred,
    },
  };
};
