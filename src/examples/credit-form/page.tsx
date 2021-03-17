import * as React from 'react';
import { reflect } from '@effector/reflect';
import styled from 'styled-components';

import { Input } from 'lib/form/input';
import { Select } from 'lib/form/select';
import { Checkbox } from 'lib/form/checkbox';
import {
  userName,
  userDate,
  userEmail,
  form,
  userCity,
  $result,
  userRulesAccept,
  checkboxTextField,
} from './model';
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
          <AgreeCheckbox />
        </Row>
        <Row>
          <TextCheckbox />
        </Row>
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

const TextCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'текстовый чекбокс',
    defaultValue: checkboxTextField.value.map((state) => state),
    defaultChecked: true,
    ...getField(checkboxTextField),
  },
});

const AgreeCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'согласие на обработку данных',
    defaultChecked: userRulesAccept.value.map((state) => state),
    ...getField(userRulesAccept),
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
