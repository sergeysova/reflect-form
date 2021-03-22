import { sample } from 'effector';

import { CheckboxFieldConfig, Field } from 'lib/types';
import { createField } from 'lib/createField';

export const checkboxField = ({
  name,
  defaultChecked = false,
  fieldValue = '',
  isRequired = false,
  requiredErrorText = 'Поле обязательно для заполнения',
  isBoolean = false,
}: CheckboxFieldConfig): Field<boolean | string> => {
  const getInitialValue = () => {
    if (defaultChecked) {
      if (isBoolean) return true;

      return fieldValue;
    }

    return isBoolean ? false : '';
  };

  const { type, value, isTouched, isValid, error, hasError, triggers, handlers } = createField<
    boolean | string
  >({
    name,
    value: getInitialValue(),
  });

  value.on(handlers.onChange, (_, e) => {
    if (isBoolean) return e.currentTarget.checked;
    return e.currentTarget.checked ? fieldValue : '';
  });

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
    triggers: {
      ...triggers,
    },
    handlers: {
      ...handlers,
    },
  };
};
