import { combine } from 'effector';
import { createInputField } from '../../lib/form';
import { createCheckboxField, createTextCheckboxField } from '../../lib/form/createField';
import { createCheckBoxFieldSet, createFieldSet } from '../../lib/form/createFieldset';

const fioPattern = /^([А-Яа-я]+\s){2,3}/gimu;

const checkYear = (year: string) => {
  const userBirthDate = Number.parseInt(year, 10);

  const diff = new Date().getFullYear() - userBirthDate;

  return !(diff > 65 || diff < 14);
};
const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const userName = createInputField({
  name: 'userFio',
  isRequired: true,
  validators: [
    (value) => (fioPattern.test(value) ? null : 'Укажите фамилию, имя и отчество через пробел'),
  ],
});

export const userDate = createInputField({
  name: 'birthDate',
  isRequired: true,
  validators: [
    (value) => (checkYear(value) ? null : 'Возраст должен быть больше 14 и меньше 65 лет'),
  ],
});

export const userEmail = createInputField({
  name: 'userEmail',
  isRequired: true,
  validators: [(value) => (validateEmail(value) ? null : 'Укажите корректный email')],
});

export const userCity = createInputField({
  name: 'userCity',
  defaultValue: 'option3',
});

export const user = createInputField({
  name: 'userCity',
  defaultValue: 'option3',
});

export const checkboxTextField = createTextCheckboxField({
  name: 'userCheckbox',
  defaultValue: 'text checkbox',
});

export const anotherCheckboxTextField = createTextCheckboxField({
  name: 'anotherUserCheckbox',
  defaultValue: 'another text checkbox',
});

export const userRulesAccept = createCheckboxField({
  name: 'userRulesAccept',
  defaultChecked: true,
  isRequired: true,
  requiredErrorText: 'Для продолжения необходимо согласие на обработку данных',
});

const checkboxSet = createCheckBoxFieldSet({
  name: 'checkboxSet',
  fields: [checkboxTextField, anotherCheckboxTextField],
});

export const form = createFieldSet({
  name: 'user',
  fields: [
    userName,
    userDate,
    userEmail,
    userCity,
    userRulesAccept,
    checkboxTextField,
    checkboxSet,
  ],
});

const $preview = combine(form.value, form.hasError, form.isValid, (value, hasError, isValid) => ({
  value,
  hasError,
  isValid,
}));

export const $result = $preview.map((s) => JSON.stringify(s, null, 2));
