import { combine } from 'effector';

import { createFieldset } from 'lib/form/createFieldset';
import { inputTextField } from 'lib/form/input';
import { checkboxField } from 'lib/form/checkbox';

const fioPattern = /^([А-Яа-я]+\s){2,3}/gimu;

export const userName = inputTextField({
  name: 'userFio',
  isRequired: true,
  fieldValue: '',
  validators: [
    (value) =>
      fioPattern.test(value as string) ? null : 'Укажите фамилию, имя и отчество через пробел',
  ],
});

export const userAge = inputTextField({
  name: 'userAge',
  fieldValue: '',
  valueAs: 'number',
});

export const userCity = inputTextField({
  name: 'userCity',
  fieldValue: 'Санкт-Петербург',
});

export const checkboxTextField = checkboxField({
  name: 'textCheckbox',
  fieldValue: 'text checkbox',
});

export const checkboxBooleanField = checkboxField({
  name: 'user accept rules',
  isBoolean: true,
  defaultChecked: true,
});

const userPlace = createFieldset('userPlace', 'object', [userCity]);

const arrayFieldSet = createFieldset('array field set', 'array', [
  checkboxBooleanField,
  checkboxTextField,
]);

const form = createFieldset('userInfo', 'object', [
  userName,
  userAge,
  checkboxBooleanField,
  checkboxTextField,
  userPlace,
  arrayFieldSet,
]);

const $preview = combine(form.isValid, form.value, (isValid, value) => ({
  isValid,
  value,
}));

export const $result = $preview.map((s) => JSON.stringify(s, null, 2));
