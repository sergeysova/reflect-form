import { createStore, sample, Store } from 'effector';

import { BaseField, FieldConfig } from '../types';
import { createField } from '../create-field';

type FieldValidator<T> = (value: T) => string | null;

interface Config<T> extends FieldConfig<T> {
  validators?: FieldValidator<T>[];
}

interface InputField<T> extends BaseField<T> {
  value: Store<T>;
  error: Store<ReturnType<FieldValidator<T>>>;
}

export const createInput = ({
  name,
  initialValue = '',
  isRequired = false,
  requiredErrorText = 'Поле обязательно для заполнения',
  validateOn,
  validators = [],
}: Config<string>): InputField<string> => {
  const field = createField<string>({ name, initialValue, validateOn });

  const $value = createStore<string>(initialValue);

  $value.on(field.handlers.onChange, (_, e) => e.currentTarget.value).reset(field.triggers.reset);

  sample({
    source: [$value, field.isTouched],
    clock: field.triggers.forceValidate,
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
    target: field.error,
  });

  sample({ source: $value, clock: field.handlers.onBlur });

  return {
    value: $value,
    ...field,
  };
};
