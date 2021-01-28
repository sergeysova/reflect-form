import * as React from 'react';
import { reflect } from 'effector-reflect';
import styled from 'styled-components';

import { Input } from './form/input';
import { firstName, lastName, email, onSubmit } from './form/form/model';

export const Home: React.FC = () => (
  <Form>
    <div>
      <FirstName />
    </div>
    <div>
      <LastName />
    </div>
    <div>
      <Email />
    </div>
  </Form>
);

const LastName = reflect({
  view: Input,
  bind: {
    value: lastName.value.map((state) => state),
    error: lastName.error.map((state) => state),
    placeholder: 'last name',
    ...lastName.handlers,
  },
});

const FirstName = reflect({
  view: Input,
  bind: {
    value: firstName.value.map((state) => state),
    error: firstName.error.map((state) => state),
    placeholder: 'first name',
    ...firstName.handlers,
  },
});

const Email = reflect({
  view: Input,
  bind: {
    value: email.value.map((state) => state),
    error: email.error.map((state) => state),
    placeholder: 'email',
    ...email.handlers,
  },
});

const Form = reflect({
  view: styled.form``,
  bind: {
    onSubmit: () => onSubmit(),
  },
});
