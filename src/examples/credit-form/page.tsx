import * as React from 'react';
import { reflect } from 'effector-reflect';
import styled from 'styled-components';

import { Input } from 'lib/form/input';

import { Content, Row, Wrapper } from './styles';

import { userName, userDate, userEmail, $form } from './model';

export const CreditForm: React.FC = () => (
  <Wrapper>
    <Content>
      <form>
        <Row>
          <Fio />
        </Row>
        <Row>
          <BirthDate />
        </Row>
        <Row>
          <Email />
        </Row>
        <Row>
          <Button>Отправить</Button>
        </Row>
      </form>
    </Content>
  </Wrapper>
);

const Fio = reflect({
  view: Input,
  bind: {
    placeholder: 'Фамилия, имя и отчество',
    value: userName.value.map((value) => value),
    error: userName.error.map((state) => state),
    ...userName.handlers,
  },
});

const BirthDate = reflect({
  view: Input,
  bind: {
    placeholder: 'Год рождения',
    value: userDate.value.map((value) => value),
    error: userDate.error.map((state) => state),
    ...userDate.handlers,
  },
});

const Email = reflect({
  view: Input,
  bind: {
    placeholder: 'Электронная почта',
    value: userEmail.value.map((value) => value),
    error: userEmail.error.map((state) => state),
    ...userEmail.handlers,
  },
});

const Button = reflect({
  view: styled.button``,
  bind: {
    type: 'submit',
    disabled: $form.hasError,
  },
});
