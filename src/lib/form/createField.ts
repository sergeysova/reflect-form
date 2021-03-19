import { ChangeEvent } from 'react';
import { createEvent, createStore, Event, forward, guard, sample, Store } from 'effector';

type FieldChangeEvent = Event<ChangeEvent<HTMLInputElement>>;
type FieldValidator<T = string> = (value: T) => string | null;
type ValidateOn = 'change' | 'blur' | 'formSubmit';
type FieldValuePatten = 'letters' | 'numbers';

interface FieldEvents {
  onChanged: FieldChangeEvent;
  onFocused: FieldChangeEvent;
  onBlurred: FieldChangeEvent;
  onTouched: Event<void>;
}

interface FieldTriggers {
  onValidate: Event<void>;
  onForceValidate: Event<void>;
}

interface FieldConfig<T> {
  name: string;
  value: T;
  validateOn?: ValidateOn;
  isRequired?: boolean;
  requiredErrorText?: string;
  validators?: FieldValidator<T>[];
}

interface InputFieldConfig<T> extends Omit<FieldConfig<T>, 'value'> {
  fieldValue: T;
  valuePattern?: FieldValuePatten;
  valueAs?: 'string' | 'number';
}

type CheckboxFieldValue = string | boolean;

interface CheckboxFieldConfig extends Omit<FieldConfig<CheckboxFieldValue>, 'value'> {
  fieldValue?: CheckboxFieldValue;
  isBoolean?: boolean;
  defaultChecked?: boolean;
}

interface FieldState<T> {
  value: Store<T>;
  error: Store<ReturnType<FieldValidator<T>>>;
  isTouched: Store<boolean>;
  isValid: Store<boolean>;
  hasError: Store<boolean>;
}

interface FieldInfo {
  type: 'field';
  name: string;
  isRequired?: boolean;
}

export interface Field<T> extends FieldState<T>, FieldInfo {
  handlers: {
    onChange: FieldChangeEvent;
    onFocus: FieldChangeEvent;
    onBlur: FieldChangeEvent;
  };
  triggers: {
    validate: Event<void>;
    forceValidate: Event<void>;
  };
}

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

  return {
    onValidate,
    onForceValidate,
  };
};

const createField = <T>({ name, value, validateOn = 'change' }: FieldConfig<T>): Field<T> => {
  const $value = createStore<T>(value);
  const $isTouched = createStore<boolean>(false);
  const $error = createStore<string | null>(null);
  const $hasError = $error.map((error) => error !== null);
  const $isValid = $value.map((value) => Boolean(value));

  const { onChanged, onBlurred, onFocused, onTouched } = createFieldEvents(name);
  const { onValidate, onForceValidate } = createFiledTriggers(name);

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
    },
  };
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

export const checkboxField = ({
  name,
  defaultChecked = false,
  fieldValue = '',
  isRequired = false,
  requiredErrorText = 'Поле обязательно для заполнения',
  isBoolean = false,
}: CheckboxFieldConfig): Field<boolean | string> => {
  const getInitialValue = () => {
    if (defaultChecked) {
      if (isBoolean) return true;

      return fieldValue;
    }

    return isBoolean ? false : '';
  };

  const { type, value, isTouched, isValid, error, hasError, triggers, handlers } = createField<
    boolean | string
  >({
    name,
    value: getInitialValue(),
  });

  value.on(handlers.onChange, (_, e) => {
    if (isBoolean) return e.currentTarget.checked;
    return e.currentTarget.checked ? fieldValue : '';
  });

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
