import { Event, Store } from 'effector';
import { ChangeEvent } from 'react';

type FieldChangeEvent = Event<ChangeEvent<HTMLInputElement>>;
export type FieldValidator<T = string> = (value: T) => string | null;

export interface Events {
  onChanged: FieldChangeEvent;
  onFocused: FieldChangeEvent;
  onBlurred: FieldChangeEvent;
  onTouched: Event<void>;
}

export interface Triggers {
  onValidate: Event<void>;
  onForceValidate: Event<void>;
  onReset: Event<void>;
  onValueSet: Event<void>;
}

export interface FieldConfig<T> {
  name: string;
  initialValue?: T;
  isRequired?: boolean;
  requiredErrorText?: string;
  validateOn?: 'change' | 'blur' | 'formSubmit';
}

interface FieldEntity<T> extends Omit<FieldConfig<T>, 'initialValue'> {
  // state
  initialValue: Store<T>;
  isValid: Store<boolean>;
  hasError: Store<boolean>;
  error: Store<string | null>;

  // handlers
  triggers: {
    validate: Event<void>;
    forceValidate: Event<void>;
    reset: Event<void>;
    valueSet: Event<T>;
  };
}

export interface Field<T> extends FieldEntity<T> {
  type: 'field';

  // state
  isTouched: Store<boolean>;

  // handlers
  handlers: {
    onChange: FieldChangeEvent;
    onFocus: FieldChangeEvent;
    onBlur: FieldChangeEvent;
  };
}

// Базовый тип для Field
export interface BaseField<T> extends Field<T> {
  value: Store<T>;
  hasError: Store<boolean>;
  error: Store<string | null>;
}

// Базовый тип для Fieldset
export interface FieldsetEntity {
  type: 'fieldset';
  name: string;
  initialValue?: any;
  triggers: {
    validate: Event<void>;
    forceValidate: Event<void>;
    reset: Event<void>;
    valueSet: Event<void>;
  };
}

export interface Fieldset<T> extends FieldsetEntity {
  value: Store<T>;
}
