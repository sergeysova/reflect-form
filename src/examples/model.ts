import { combine } from 'effector';

import { createField, fieldSet, listSet, createInput, createSelect, createCheckbox } from 'lib';

const inputFieldPattern = /^([А-Яа-я]+\s){2,3}/gimu;

const selectOptions = [
  {
    value: 'Select option',
    label: 'Select option',
  },
  {
    value: 'Select option selected',
    label: 'Select option selected',
    selected: true,
  },
  {
    value: 'Select option disabled',
    label: 'Select option disabled',
    disabled: true,
  },
];

export const baseField = createField({
  name: 'baseField',
  initialValue: 'Base field with initial value',
});

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

export const selectFieldWithInitialValue = createSelect({
  name: 'selectField',
  options: selectOptions,
});

export const textCheckboxField = createCheckbox({
  name: 'text default checkbox field',
  initialValue: 'text checkbox field',
});

export const textDefaultCheckedCheckboxField = createCheckbox({
  name: 'text default checked checkbox field',
  initialValue: 'text default checked checkbox field',
  defaultChecked: true,
});

export const booleanCheckboxField = createCheckbox({
  name: 'boolean checkbox field',
  defaultChecked: true,
  isBoolean: true,
});

const listGroup = listSet('listGroup', [
  textCheckboxField,
  textDefaultCheckedCheckboxField,
  booleanCheckboxField,
]);

const form = fieldSet('baseFieldSet', [
  inputFieldWithValidator,
  selectFieldWithInitialValue,
  textCheckboxField,
  textDefaultCheckedCheckboxField,
  booleanCheckboxField,
  listGroup,
]);

const $preview = combine(form.value, (value) => ({
  value,
}));

export const $result = $preview.map((s) => JSON.stringify(s, null, 2));
