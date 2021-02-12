import { ChangeEvent } from 'react';
import { Event, Store } from 'effector';

export type FieldValidator = (value: string) => string | null;

type ValidateOn = 'change' | 'blur' | 'formSubmit';

export type FieldChangeEvent = Event<ChangeEvent<HTMLInputElement>>;

export type FieldConfig = {
  name: string;
  initialValue?: string;
  inputRequiredErrorText?: string;
  isRequired?: boolean;
  validateOn?: ValidateOn;
  validators?: FieldValidator[];
  inputValuePattern?: 'letters' | 'numbers';
};

export interface FieldState {
  error: Store<ReturnType<FieldValidator>>;
  isTouched: Store<boolean>;
  value: Store<string>;
}

export interface Field extends FieldState, Pick<FieldConfig, 'name'> {
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
  value: Store<{
    [name: string]: unknown;
  }>;
}
