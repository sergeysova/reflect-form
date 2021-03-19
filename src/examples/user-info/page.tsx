import * as React from 'react';
import { reflect } from '@effector/reflect';
import styled from 'styled-components';

import { Checkbox } from '../../lib/form/checkbox';
import { Input } from 'lib/form/input';

import {
  userName,
  checkboxTextField,
  checkboxBooleanField,
  $result,
  userCity,
  userAge,
} from './model';
import { Content, Row, Wrapper } from './styles';

export const UserForm: React.FC = () => (
  <Wrapper>
    <Content>
      <form>
        <Row>
          <Fio />
        </Row>
        <Row>
          <Age />
        </Row>
        <Row>
          <City />
        </Row>
        <Row>
          <TextCheckbox />
        </Row>
        <Row>
          <BooleanCheckbox />
        </Row>
      </form>
      <Result />
    </Content>
  </Wrapper>
);

const getField = (field: any) => ({
  value: field.value.map((state: string | boolean) => state),
  error: field.error.map((state: string | boolean) => state),
  ...field.handlers,
});

const Fio = reflect({
  view: Input,
  bind: {
    placeholder: 'Фамилия, имя и отчество',
    ...getField(userName),
  },
});

const Age = reflect({
  view: Input,
  bind: {
    placeholder: 'Возраст',
    ...getField(userAge),
  },
});

const City = reflect({
  view: Input,
  bind: {
    placeholder: 'Город',
    ...getField(userCity),
  },
});

const TextCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'текстовый чекбокс',
    defaultValue: checkboxTextField.value.map((state) => state),
    ...getField(checkboxTextField),
  },
});

const BooleanCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'boolean чекбокс',
    defaultValue: checkboxBooleanField.value.map((state) => state),
    checked: Boolean(checkboxBooleanField.value),
    ...getField(checkboxBooleanField),
  },
});

const Result = reflect({
  view: styled.pre``,
  bind: { children: $result },
});
