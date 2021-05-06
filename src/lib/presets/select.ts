import { createStore, sample, Store } from 'effector';
import { OptionHTMLAttributes } from 'react';

import { BaseField, FieldConfig } from '../types';
import { createField } from '../create-field';

type SelectOptions = OptionHTMLAttributes<HTMLOptionElement>;

interface Config<T> extends FieldConfig<T> {
  options: SelectOptions[];
}

export interface SelectField<T> extends BaseField<T> {
  value: Store<T>;
  options: SelectOptions[];
}

export function createSelect({
  name,
  isRequired = false,
  requiredErrorText = 'Поле обязательно для заполнения',
  validateOn,
  options = [],
}: Config<string>): SelectField<string> {
  const initialValue = options.filter((option) => option.selected)[0];
  const field = createField<any>({
    name,
    initialValue: initialValue.value || '',
    validateOn,
  });

  const $value = createStore<any>(initialValue.value || '');

  $value.on(field.handlers.onChange, (_, e) => e.currentTarget.value).reset(field.triggers.reset);

  sample({
    source: [$value, field.isTouched],
    clock: field.triggers.forceValidate,
    fn: ([value, isTouched]) => {
      if (isTouched && isRequired && `${value}`.length === 0) return requiredErrorText;

      return null;
    },
    target: field.error,
  });

  sample({ source: $value, clock: field.handlers.onBlur });

  return {
    value: $value,
    options,
    ...field,
  };
}
