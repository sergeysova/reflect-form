import { combine } from 'effector';

import { createFieldset } from 'lib/createFieldset';
import { inputTextField } from './input';
import { checkboxField } from './checkbox';
import { checkboxFieldset } from './checkbox/fieldset';

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

const userPlace = createFieldset('userPlace', [userCity], 'object');

const arrayFieldSet = createFieldset(
  'array field set',
  [checkboxBooleanField, checkboxTextField],
  'array',
);

// custom checkbox group with validator
export const html = checkboxField({ name: 'html', fieldValue: 'html' });
export const css = checkboxField({ name: 'css', fieldValue: 'css' });
export const js = checkboxField({ name: 'js', fieldValue: 'js' });
export const web = checkboxFieldset('web', [html, css, js], { size: { min: 0, max: 2 } });

const form = createFieldset(
  'userInfo',
  [userName, userAge, checkboxBooleanField, checkboxTextField, userPlace, arrayFieldSet, web],
  'object',
);

const $preview = combine(form.isValid, form.value, (isValid, value) => ({
  isValid,
  value,
}));

export const $result = $preview.map((s) => JSON.stringify(s, null, 2));
web.hasError.watch((state) => console.log(state));
