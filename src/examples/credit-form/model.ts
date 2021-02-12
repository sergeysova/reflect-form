import { createField, createFieldset } from '../../lib/form';

const fioPattern = /^(\w+\s){2,3}/gimu;
const checkYear = (year: string) => {
  const userBirthDate = parseInt(year);

  const diff = new Date().getFullYear() - userBirthDate;

  if (diff > 65 || diff < 14) return false;

  return true;
};
const validateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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
  inputValuePattern: 'numbers',
  validators: [
    (value) => (checkYear(value) ? null : 'Возраст должен быть больше 14 и меньше 65 лет'),
  ],
});

export const userEmail = createField({
  name: 'userEmail',
  isRequired: true,
  validators: [(value) => (validateEmail(value) ? null : 'Укажите корректный email')],
});

export const $form = createFieldset('user', [userName, userDate, userEmail]);

$form.value.watch((store) => console.log(store));
