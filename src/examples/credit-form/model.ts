import { combine, restore } from 'effector';
import { createField, createFieldset } from '../../lib/form';

const fioPattern = /^([А-Яа-я]+\s){2,3}/gimu;

const checkYear = (year: string) => {
  const userBirthDate = parseInt(year);

  const diff = new Date().getFullYear() - userBirthDate;

  return !(diff > 65 || diff < 14);
};
const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const userName = createField({
  name: 'userFio',
  isRequired: true,
  validators: [
    (value) => (fioPattern.test(value) ? null : 'Укажите фамилию, имя и отчество через пробел'),
  ],
});

export const userDate = createField({
  name: 'birthDate',
  isRequired: true,
  validators: [
    (value) => (checkYear(value) ? null : 'Возраст должен быть больше 14 и меньше 65 лет'),
  ],
});

export const userEmail = createField({
  name: 'userEmail',
  isRequired: true,
  validators: [(value) => (validateEmail(value) ? null : 'Укажите корректный email')],
});

export const userCity = createField({
  name: 'userCity',
  defaultValue: 'option3',
});

export const form = createFieldset('user', [userName, userDate, userEmail, userCity]);

const $preview = combine(form.value, form.hasError, form.isValid, (value, hasError, isValid) => ({
  value,
  hasError,
  isValid,
}));

export const $result = $preview.map((s) => JSON.stringify(s, null, 2));

form.triggers.validate.watch(() => console.log('validated'));
