import { ChangeEvent } from 'react';
import { Event, Store, Effect } from 'effector';

export type FieldValidatorParams = {
  value: string;
  name: string;
  touched: boolean;
  error: ReturnType<FieldValidator>;
}

export type FieldValidator = Effect<FieldValidatorParams, any, any>;

type ValidateOn = 'change' | 'blur' | 'formSubmit';

export type FieldChangeEvent = Event<ChangeEvent<HTMLInputElement>>;

export type FieldConfig = {
  name: string;
  initialValue?: string;
  inputRequiredErrorText?: string;
  isRequired?: boolean;
  validateOn?: ValidateOn;
  validators?: FieldValidator[];
};

export interface FieldState {
  error: Store<ReturnType<FieldValidator>>;
  isTouched: Store<boolean>;
  value: Store<string>;
}

export interface Field extends FieldState, Pick<FieldConfig, 'name'> {
  type: 'field';
  hasError: Store<boolean>;
  validationPending: Store<boolean>,
  handlers: {
    onChange: FieldChangeEvent;
    onFocus: FieldChangeEvent;
    onBlur: FieldChangeEvent;
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
