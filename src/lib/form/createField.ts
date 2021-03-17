import { ChangeEvent } from 'react';
import { createEvent, createStore, forward, guard, sample } from 'effector';
import {
  BaseFieldConfig,
  InputField,
  InputFieldConfig,
  FieldEvents,
  FieldValuePatten,
  CheckboxField,
  CheckboxFieldConfig,
} from './types';

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

const createFieldEvents = (name: string): FieldEvents => {
  const onChanged = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Changed`);
  const onFocused = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Focused`);
  const onBlurred = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Blurred`);
  const onTouched = createEvent<void>(`${name}Touched`);
  const onValidate = createEvent<void>(`${name}ValidationTriggered`);
  const onForceValidate = createEvent<void>(`${name}ForceValidationTriggered`);

  return {
    onChanged,
    onFocused,
    onBlurred,
    onTouched,
    onValidate,
    onForceValidate,
  };
};

const createField = <T>({ name, defaultValue, validateOn = 'change' }: BaseFieldConfig<T>) => {
  const $value = createStore<T>(defaultValue as T);
  const $isTouched = createStore<boolean>(false);
  const $error = createStore<string | null>(null);
  const $hasError = $error.map((error) => error !== null);

  const {
    onChanged,
    onBlurred,
    onFocused,
    onTouched,
    onValidate,
    onForceValidate,
  } = createFieldEvents(name);

  $isTouched
    .on(onValidate, () => true)
    .on(onTouched, (touched) => {
      if (touched) return;
      return !touched;
    });

  forward({
    from: onFocused,
    to: onTouched,
  });

  forward({ from: onValidate, to: onForceValidate });

  forward({
    from: {
      change: onChanged,
      blur: onBlurred,
      focus: onFocused,
      formSubmit: createEvent(),
    }[validateOn],
    to: onForceValidate,
  });

  sample({
    source: $value,
    clock: onBlurred,
  });

  return {
    value: $value,
    error: $error,
    isTouched: $isTouched,
    hasError: $hasError,
    triggers: {
      validate: onValidate,
      forceValidate: onForceValidate,
    },
    handlers: {
      onChange: onChanged,
      onFocus: onFocused,
      onBlur: onBlurred,
    },
  };
};

// TODO add patronum debounce to field validation
export const createInputField = ({
  isRequired = false,
  validators = [],
  defaultValue = '',
  name,
  validateOn,
  requiredErrorText = 'Поле обязательно для заполнения',
  valuePattern,
}: InputFieldConfig): InputField => {
  const { value, isTouched, hasError, error, handlers, triggers } = createField({
    name,
    defaultValue,
    validateOn,
  });
  const $isValid = value.map((value) => !(!value.length && isRequired));

  value.on(
    guard({
      source: handlers.onChange,
      filter: (value) => checkFieldPattern(value, valuePattern),
    }),
    (_, e) => e.currentTarget.value,
  );

  sample({
    source: [value, isTouched],
    clock: triggers.forceValidate,
    fn: ([value, isTouched]) => {
      if (isTouched && isRequired && value.length === 0) return requiredErrorText;

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
    type: 'field',
    name,
    value,
    isTouched,
    isRequired,
    isValid: $isValid,
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

export const createCheckboxField = ({
  name,
  defaultChecked,
  validateOn,
  isRequired = false,
  requiredErrorText = 'Поле обязательно для заполнения',
}: CheckboxFieldConfig<boolean>): CheckboxField<boolean> => {
  const { value, isTouched, hasError, error, handlers, triggers } = createField({
    name,
    defaultValue: Boolean(defaultChecked),
    validateOn,
  });
  const $isValid = value.map((value) => !value && isRequired);

  value.on(handlers.onChange, (_, e) => e.currentTarget.checked);

  sample({
    source: [value, isTouched],
    clock: triggers.forceValidate,
    fn: ([value, isTouched]) => {
      if (isTouched && isRequired && !value) return requiredErrorText;

      return null;
    },
    target: error,
  });

  return {
    type: 'field',
    name,
    value,
    isTouched,
    isRequired,
    isValid: $isValid,
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

export const createTextCheckboxField = ({
  name,
  defaultValue = '',
  validateOn,
  isRequired = false,
  requiredErrorText = 'Поле обязательно для заполнения',
}: CheckboxFieldConfig<string>): CheckboxField<string> => {
  const { value, isTouched, hasError, error, handlers, triggers } = createField({
    name,
    defaultValue,
    validateOn,
  });
  const $isValid = value.map((value) => !(!value.length && isRequired));

  value.on(handlers.onChange, (_, e) => (e.currentTarget.checked ? defaultValue : ''));

  sample({
    source: [value, isTouched],
    clock: triggers.forceValidate,
    fn: ([value, isTouched]) => {
      if (isTouched && isRequired && value.length === 0) return requiredErrorText;

      return null;
    },
    target: error,
  });

  return {
    type: 'field',
    name,
    value,
    isTouched,
    isRequired,
    isValid: $isValid,
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
