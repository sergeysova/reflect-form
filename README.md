## Reflect form

### Input view

```tsx
import * as React from 'react';

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

Creates single field

```
createField(config: FieldConfig): Field;
```
**Arguments**

1. config

| key                    | required | type                                  | defaultValue                      |
|------------------------|----------|---------------------------------------|-----------------------------------|
| name                   | true     | string                                |                                   |
| initialValue           | false    | string                                | ''                                |
| inputRequiredErrorText | false    | string                                | 'Поле обязательно для заполнения' |
| isRequired             | false    | boolean                               | false                             |
| validateOn             | false    | 'change' \| 'blur' \| 'formSubmit'    | 'change'                          |
| validators             | false    | ((value: string) => string \| null)[] | []                                |


**Usage**

```tsx
// model
import { createField } from "./createField";

export const field = createField({
  name: 'firstName',
  validators: [
    (value) => (value.length <= 3 ? 'Введите больше 3-х символов' : null),
    (value) => (value.length < 5 ? 'Введите больше 5-ти символов' : null),
  ],
  isRequired: true,
});

// view
const Field = reflect({
  view: Input,
  bind: {
    value: field.value.map((state) => state),
    error: field.error.map((state) => state),
    placeholder: 'first name',
    ...field.handlers,
  },
});

export const Form: React.FC = () => (
  <form>
    <Field />
  </form>
);
```


### Create fieldset

Creates group of fields

```
createFieldset(name: string, fields: (Field | FieldSet)[]): FieldSet;
```

**Usage**

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

const user = createFieldset('user', [firstName, lastName]);

const form = createFieldset('form', [user, email]);
```
