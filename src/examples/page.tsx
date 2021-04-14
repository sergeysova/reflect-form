import * as React from 'react';
import styled from 'styled-components';

import { reflect } from '@effector/reflect';

import { Content, Row, Wrapper } from './styles';

import { Checkbox, Input, Select } from './views';

import {
  $result,
  baseField,
  booleanCheckboxField,
  inputFieldWithValidator,
  selectFieldWithInitialValue,
  textCheckboxField,
  textDefaultCheckedCheckboxField,
} from './model';

export const ExampleForm: React.FC = () => (
  <Wrapper>
    <Content>
      <form>
        <Row>
          <BaseField />
        </Row>
        <Row>
          <InputFieldWithValidator />
        </Row>
        <Row>
          <SelectField />
        </Row>
        <Row>
          <div>
            <TextCheckbox />
            <TextDefaultCheckedCheckbox />
            <BooleanCheckbox />
          </div>
        </Row>
      </form>
      <Result />
    </Content>
  </Wrapper>
);

const BaseField = reflect({
  view: Input,
  bind: {
    value: baseField.initialValue.map((value) => value),
    ...baseField.handlers,
  },
});

const InputFieldWithValidator = reflect({
  view: Input,
  bind: {
    placeholder: 'Input field with validator',
    value: inputFieldWithValidator.value.map((v) => v),
    error: inputFieldWithValidator.error.map((e) => e),
    ...inputFieldWithValidator.handlers,
  },
});

const SelectField = reflect({
  view: Select,
  bind: {
    value: selectFieldWithInitialValue.value.map((v) => v),
    options: selectFieldWithInitialValue.options,
    ...selectFieldWithInitialValue.handlers,
  },
});

const TextCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'Text checkbox',
    value: textCheckboxField.value.map((v) => v),
    ...textCheckboxField.handlers,
  },
});

const TextDefaultCheckedCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'Text checkbox default checked',
    value: textDefaultCheckedCheckboxField.value.map((v) => v),
    checked: textDefaultCheckedCheckboxField.value.map((v) => v.length),
    ...textDefaultCheckedCheckboxField.handlers,
  },
});

const BooleanCheckbox = reflect({
  view: Checkbox,
  bind: {
    label: 'Boolean checkbox',
    value: booleanCheckboxField.value.map((v) => v),
    checked: booleanCheckboxField.value.map((v) => v),
    ...booleanCheckboxField.handlers,
  },
});

const Result = reflect({
  view: styled.pre``,
  bind: { children: $result },
});
