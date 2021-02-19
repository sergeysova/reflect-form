import { ChangeEvent } from 'react';
import { Event, Store } from 'effector';

export type FieldValidator = (value: string) => string | null;

type ValidateOn = 'change' | 'blur' | 'formSubmit';

export type FieldChangeEvent = Event<ChangeEvent<HTMLInputElement>>;

export type FieldValuePatten = 'letters' | 'numbers';

export interface FieldConfig {
  name: string;
  defaultValue?: string;
  isRequired?: boolean;
  validateOn?: ValidateOn;
  validators?: FieldValidator[];
  fieldRequiredErrorText?: string;
  fieldValuePattern?: FieldValuePatten;
}

export interface FieldState {
  error: Store<ReturnType<FieldValidator>>;
  isTouched: Store<boolean>;
  isValid: Store<boolean>;
  value: Store<string>;
}

export interface Field extends FieldState, Pick<FieldConfig, 'name' | 'isRequired'> {
  type: 'field';
  hasError: Store<boolean>;
  handlers: {
    onChange: FieldChangeEvent;
    onFocus: FieldChangeEvent;
    onBlur: FieldChangeEvent;
  };
  triggers: {
    validate: Event<any>;
  };
}

export interface FieldSet {
  name: string;
  hasError: Store<boolean>;
  type: 'fieldset';
  isValid: Store<boolean>;
  value: Store<{
    [name: string]: unknown;
  }>;
}
