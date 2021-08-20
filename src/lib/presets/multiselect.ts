import { createStore, sample, Store } from 'effector';
import { OptionHTMLAttributes } from 'react';

import { BaseField, FieldConfig } from '../types';
import { createField } from '../create-field';

type MultiSelectOptions = OptionHTMLAttributes<HTMLOptionElement>;

interface Config<T> extends FieldConfig<T> {
  options: MultiSelectOptions[];
}

export interface MultiSelectField<T> extends BaseField<T> {
  value: Store<T>;
  options: MultiSelectOptions[];
}

export function createMultiSelect({
  name,
  isRequired = false,
  requiredErrorText = 'Поле обязательно для заполнения',
  validateOn,
  options = [],
}: Config<string>): MultiSelectField<Array<string>> {
  const initialValue = options
    .filter((option) => option.selected)
    .map((option) => option.value as string);

  const $values = createStore<Array<string>>(initialValue);

  const field = createField<any>({
    name,
    initialValue,
    validateOn,
  });

  $values
    .on(field.handlers.onChange, (_, event: any) =>
      Array.from(
        event.target.selectedOptions,
        (option: MultiSelectOptions) => option.value as string,
      ),
    )
    .reset(field.triggers.reset);

  sample({
    source: [$values, field.isTouched],
    clock: field.triggers.forceValidate,
    fn: ([value, isTouched]) => {
      if (isTouched && isRequired && `${value}`.length === 0) return requiredErrorText;

      return null;
    },
    target: field.error,
  });

  sample({ source: $values, clock: field.handlers.onBlur });

  return {
    value: $values,
    options,
    ...field,
  };
}
