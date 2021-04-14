## Reflect form

### Input view

```tsx
import * as React from 'react';

type FieldValidator<T = string> = (value: T) => string | null;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error: ReturnType<FieldValidator>;
  onChange: () => unknown;
}

export const Input: React.FC<InputProps> = (props) => (
  <div>
    {props.error && <div>{props.error}</div>}
    <input type="text" {...props} />
  </div>
);
```

### Create field

Use ```createField``` to create your own fields

```NOTE: createField returns Field without value & change value handler```

**Examples**

***1. Create custom field***
```tsx
import { createStore, sample, Store } from 'effector';

import { BaseField, FieldConfig } from 'types';
import { createField } from 'createField';

// 1. create your own field validator
type FieldValidator<T> = (value: T) => string | null;

// 2. extend field config form base config
interface Config<T> extends FieldConfig<T> {
  validators?: FieldValidator<T>[];
}

// 3. extend your field from BaseField
interface InputField<T> extends BaseField<T> {
  value: Store<T>;
  error: Store<ReturnType<FieldValidator<T>>>;
}

// 4. create any field
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
```

***2. Usage***

```tsx
// model
import { createInput } from "./input";

export const inputFieldWithValidator = createInput({
  name: 'inputField',
  initialValue: '',
  isRequired: true,
  validators: [
    (value) =>
      inputFieldPattern.test(value as string)
        ? null
        : 'Укажите фамилию, имя и отчество через пробел',
  ],
});

// view
const InputFieldWithValidator = reflect({
  view: Input,
  bind: {
    placeholder: 'Input field with validator',
    value: inputFieldWithValidator.value.map((v) => v),
    error: inputFieldWithValidator.error.map((e) => e),
    ...inputFieldWithValidator.handlers,
  },
});

export const Form: React.FC = () => (
  <form>
    <InputFieldWithValidator />
  </form>
);
```


### Create fieldset

Creates group of fields or groups inside groups

***1. Create custom fieldset***

```tsx
export const listSet = (
  name: string,
  fields: (FieldSet<any> | BaseField<any>)[],
): FieldSet<any> => {
  const values = getFieldSetValueAsArray(fields);

  const fieldSet = createFieldset<any>({ name, initialValue: combine(values) });

  return {
    ...fieldSet,
    value: combine(values, (values) => values.filter((value) => value.length > 0)),
  };
};
```


***2. Usage***

```tsx
const firstName = createField({
  name: 'firstName',
  isRequired: true,
});

const lastName = createField({
  name: 'lastName',
  validateOn: 'blur',
  isRequired: true,
});

const email = createField({
  name: 'email',
});

const $user = createFieldset('user', [firstName, lastName]);
const $list = listSet('list', [firstName, lastName]);

const form = createFieldset('form', [$user, email, $list]);

/// form value output
const output = {
  value: {
    user: {
      firstName: '', 
      lastName: '' 
    },
    email: '',
    list: ['firstNameValue', 'lastNameValue']
  }
}
```
