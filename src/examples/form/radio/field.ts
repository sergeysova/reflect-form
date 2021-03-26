import { createStore, sample, Store } from 'effector';

import { CheckboxFieldConfig, Field } from 'lib/types';
import { createField } from 'lib/createField';

export interface RadioField extends Field<boolean | string> {
  isChecked: Store<boolean>;
}

export const radioField = ({
  name,
  defaultChecked = false,
  fieldValue = '',
  isRequired = false,
  requiredErrorText = 'Поле обязательно для заполнения',
}: CheckboxFieldConfig): RadioField => {
  const { type, value, isTouched, isValid, error, hasError, triggers, handlers } = createField<
    boolean | string
  >({
    name,
    value: defaultChecked ? fieldValue : '',
  });

  const isChecked = createStore<boolean>(defaultChecked);

  value.on(handlers.onChange, (_, e) => (e.currentTarget.checked ? fieldValue : ''));
  isChecked.on(handlers.onChange, (_, e) => e.currentTarget.checked);

  sample({
    source: [value, isTouched],
    clock: triggers.forceValidate,
    fn: ([value, isTouched]) => {
      if (isTouched && isRequired && !value) return requiredErrorText;

      return null;
    },
    target: error,
  });

  return {
    type,
    name,
    value,
    isTouched,
    isRequired,
    isValid,
    error,
    hasError,
    isChecked,
    triggers: {
      ...triggers,
    },
    handlers: {
      ...handlers,
    },
  };
};
