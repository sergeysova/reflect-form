import { Event, Store } from 'effector';
import { ChangeEvent } from 'react';

export type FieldChangeEvent = Event<ChangeEvent<HTMLInputElement>>;
export type FieldValidator<T = string> = (value: T) => string | null;
export type ValidateOn = 'change' | 'blur' | 'formSubmit';
export type FieldValuePatten = 'letters' | 'numbers';

export interface FieldEvents {
  onChanged: FieldChangeEvent;
  onFocused: FieldChangeEvent;
  onBlurred: FieldChangeEvent;
  onTouched: Event<void>;
}

export interface FieldTriggers {
  onValidate: Event<void>;
  onForceValidate: Event<void>;
}

export interface FieldConfig<T> {
  name: string;
  value: T;
  validateOn?: ValidateOn;
  isRequired?: boolean;
  requiredErrorText?: string;
  validators?: FieldValidator<T>[];
}

export interface InputFieldConfig<T> extends Omit<FieldConfig<T>, 'value'> {
  fieldValue: T;
  valuePattern?: FieldValuePatten;
  valueAs?: 'string' | 'number';
}

export type CheckboxFieldValue = string | boolean;

export interface CheckboxFieldConfig extends Omit<FieldConfig<CheckboxFieldValue>, 'value'> {
  fieldValue?: CheckboxFieldValue;
  isBoolean?: boolean;
  defaultChecked?: boolean;
}

export interface FieldState<T> {
  value: Store<T>;
  error: Store<ReturnType<FieldValidator<T>>>;
  isTouched: Store<boolean>;
  isValid: Store<boolean>;
  hasError: Store<boolean>;
}

export interface FieldInfo {
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

export type FieldSetType = 'object' | 'array';

export type FieldSetValues = { [key: string]: Store<any> } | Store<any>[];

export interface FieldSet {
  name: string;
  type: 'fieldset';
  value: Store<FieldSetValues>;
  triggers: {
    validate: Event<void>;
  };
  isValid: Store<boolean>;
}
