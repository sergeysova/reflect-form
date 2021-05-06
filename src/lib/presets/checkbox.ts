import { createStore, sample } from 'effector';

import { BaseField, FieldConfig } from '../types';
import { createField } from '../create-field';

export interface CheckboxConfig<T> extends FieldConfig<T> {
  isBoolean?: boolean;
  defaultChecked?: boolean;
}

export function createCheckbox({
  name,
  initialValue = '',
  isRequired,
  defaultChecked = false,
  isBoolean,
  requiredErrorText = 'Поле обязательно для заполнения',
}: CheckboxConfig<any>): BaseField<any> {
  const getInitialValue = () => {
    if (defaultChecked) {
      if (isBoolean) return true;

      return initialValue;
    }

    return isBoolean ? false : '';
  };

  const $value = createStore<string | boolean>(getInitialValue());

  const field = createField({ name, initialValue: getInitialValue(), validateOn: 'change' });

  $value.on(field.handlers.onChange, (_, e) => {
    if (isBoolean) return e.currentTarget.checked;
    return e.currentTarget.checked ? initialValue : '';
  });

  sample({
    source: [$value, field.isTouched],
    clock: field.triggers.forceValidate,
    fn: ([value, isTouched]) => {
      if (isTouched && isRequired && !value) return requiredErrorText;

      return null;
    },
    target: field.error,
  });

  return {
    value: $value,
    ...field,
  };
}
