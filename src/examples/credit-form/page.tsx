import * as React from 'react';
import { reflect } from '@effector/reflect';
import styled from 'styled-components';

import { Input } from 'lib/form/input';
import { Field } from 'lib/form/types';
import { Select } from 'lib/form/select';
import { userName, userDate, userEmail, form, userCity, $result } from './model';
import { Content, Row, Wrapper } from './styles';

const OPTIONS = [
  {
    label: 'option1',
    value: 'option1',
  },
  {
    label: 'option2',
    value: 'option2',
    disabled: true,
  },
  {
    label: 'option3',
    value: 'option3',
  },
];

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
        <City name="select" options={OPTIONS} />
        <Row>
          <Button>Отправить</Button>
        </Row>
      </form>
      <Result />
    </Content>
  </Wrapper>
);

const Result = reflect({
  view: styled.pre``,
  bind: { children: $result },
});

const getField = (field: Field) => ({
  value: field.value.map((state) => state),
  error: field.error.map((state) => state),
  ...field.handlers,
});

const Fio = reflect({
  view: Input,
  bind: {
    placeholder: 'Фамилия, имя и отчество',
    ...getField(userName),
  },
});

const BirthDate = reflect({
  view: Input,
  bind: {
    placeholder: 'Год рождения',
    ...getField(userDate),
  },
});

const Email = reflect({
  view: Input,
  bind: {
    placeholder: 'Электронная почта',
    ...getField(userEmail),
  },
});

const City = reflect({
  view: Select,
  bind: {
    defaultValue: userCity.value.map((state) => state),
    ...getField(userCity),
  },
});

const Button = reflect({
  view: styled.button``,
  bind: {
    // type: 'submit',
    onClick: (e) => {
      e.preventDefault();
      form.triggers.validate();
    },
  },
});
