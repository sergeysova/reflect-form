import * as React from 'react';
import { combine } from 'effector';
import { reflect } from '@effector/reflect';
import styled from 'styled-components';

import { Checkbox } from './checkbox';
import { Input } from './input';

import {
  userName,
  checkboxTextField,
  checkboxBooleanField,
  js,
  html,
  css,
  web,
  $result,
  userCity,
  userAge,
  form,
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
        <Row>Выберите 2 технологии:</Row>
        <Row>
          <Row>
            <JsCheckbox />
          </Row>
          <Row>
            <HtmlCheckbox />
          </Row>
          <Row>
            <CssCheckbox />
          </Row>
        </Row>
        <Row>
          <Reset>Reset</Reset>
          <SetName>Set name</SetName>
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
    defaultChecked: true,
    ...getField(checkboxBooleanField),
  },
});

// disabled option is only example dont use it :)
const JsCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'JS',
    defaultValue: js.value.map((state) => state),
    disabled: combine(
      web.hasError,
      js.value,
      (groupError, fieldValue) => groupError && !fieldValue.toString().length,
    ),
    ...getField(js),
  },
});

const HtmlCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'HTML',
    defaultValue: html.value.map((state) => state),
    disabled: combine(
      web.hasError,
      html.value,
      (groupError, fieldValue) => groupError && !fieldValue.toString().length,
    ),
    ...getField(html),
  },
});

const CssCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'CSS',
    defaultValue: css.value.map((state) => state),
    disabled: combine(
      web.hasError,
      css.value,
      (groupError, fieldValue) => groupError && !fieldValue.toString().length,
    ),
    ...getField(css),
  },
});

const Reset = reflect({
  view: styled.button``,
  bind: {
    onClick: (e) => {
      e.preventDefault();
      form.triggers.reset();
    },
  },
});

const SetName = reflect({
  view: styled.button``,
  bind: {
    onClick: (e) => {
      e.preventDefault();
      userName.triggers.valueSet('Иван');
    },
  },
});

const Result = reflect({
  view: styled.pre``,
  bind: { children: $result },
});
