import {
  createCheckbox,
  createField,
  createFieldset,
  createInput,
  createList,
  createMultiSelect,
  createSelect,
} from 'lib';

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

const multiSelectOptions = [
  {
    value: 'option 1',
    label: 'option 1',
    selected: true,
  },
  {
    value: 'option 2',
    label: 'option 2',
  },
  {
    value: 'option 3',
    label: 'option 3',
    selected: true,
  },
  {
    value: 'option disabled',
    label: 'option disabled',
    disabled: true,
  },
];

export const multiSelectValues = ['option 1', 'option 2'];

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

export const multiSelectFieldWithInitialValue = createMultiSelect({
  name: 'multiSelectField',
  options: multiSelectOptions,
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

const listGroup = createList('listGroup', [
  textCheckboxField,
  textDefaultCheckedCheckboxField,
  booleanCheckboxField,
]);

const form = createFieldset('baseFieldSet', [
  inputFieldWithValidator,
  selectFieldWithInitialValue,
  multiSelectFieldWithInitialValue,
  textCheckboxField,
  textDefaultCheckedCheckboxField,
  booleanCheckboxField,
  listGroup,
]);

export const $result = form.value.map((s) => JSON.stringify(s, null, 2));
