import { ChangeEvent } from 'react';
import { Event, Store } from 'effector';

export type FieldValidator = (value: string) => string | null;

type ValidateOn = 'change' | 'blur' | 'formSubmit';

export type FieldChangeEvent = Event<ChangeEvent<HTMLInputElement>>;

export type FieldValuePatten = 'letters' | 'numbers';

export interface BaseFieldConfig<T> {
  name: string;
  defaultValue?: T;
  validateOn?: ValidateOn;
  isRequired?: boolean;
  requiredErrorText?: string;
}

export interface CheckboxFieldConfig<T> extends BaseFieldConfig<T> {
  defaultChecked?: boolean;
}

export interface InputFieldConfig extends BaseFieldConfig<string> {
  validators?: FieldValidator[];
  valuePattern?: FieldValuePatten;
}

export interface FieldState<T> {
  value: Store<T>;
  error: Store<ReturnType<FieldValidator>>;
  isTouched: Store<boolean>;
  isValid: Store<boolean>;
}

export interface FieldEvents {
  onChanged: FieldChangeEvent;
  onFocused: FieldChangeEvent;
  onBlurred: FieldChangeEvent;
  onTouched: Event<void>;
  onValidate: Event<void>;
  onForceValidate: Event<void>;
}

interface Field<T> extends Omit<FieldState<T>, 'isValid'> {
  hasError: Store<boolean>;
  handlers: {
    onChange: FieldChangeEvent;
    onFocus: FieldChangeEvent;
    onBlur: FieldChangeEvent;
  };
  triggers: {
    validate: Event<void>;
    forceValidate?: Event<void>;
  };
}

export interface InputField
  extends Field<string>,
    FieldState<string>,
    Pick<BaseFieldConfig<string>, 'name' | 'isRequired'> {
  type: 'field';
}

export interface CheckboxField<T>
  extends Field<T>,
    FieldState<T>,
    Pick<BaseFieldConfig<T>, 'name' | 'isRequired'> {
  type: 'field';
}

export interface BaseFieldSet<T>
  extends Pick<InputField, 'name' | 'triggers' | 'isValid' | 'hasError'> {
  type: 'fieldset';
  value: Store<T>;
}

export type InputFieldSetValue = Store<{
  [name: string]: unknown;
}>;

export type CheckboxSetValue = Store<string[]>;

export type InputFieldSet = BaseFieldSet<InputFieldSetValue> &
  Pick<InputField, 'name' | 'hasError'>;

export type CheckboxSet = BaseFieldSet<CheckboxSetValue> &
  Pick<CheckboxField<string>, 'name' | 'hasError'>;

export type FieldSetValues =
  | {
      [name: string]: unknown;
    }
  | string[];

export type FormField = InputField | CheckboxField<string> | CheckboxField<boolean>;

export type FormFieldSet = InputFieldSet | CheckboxSet;
