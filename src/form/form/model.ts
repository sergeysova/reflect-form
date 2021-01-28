import { createEvent } from 'effector';
import { createField, createFieldset } from '../lib';

export const onSubmit = createEvent('');

export const firstName = createField({
  name: 'firstName',
  validators: [
    (value) => (value.length <= 3 ? 'Введите больше 3-х символов' : null),
    (value) => (value.length < 5 ? 'Введите больше 5-ти символов' : null),
  ],
  validateOn: 'change',
  isRequired: true,
});

export const lastName = createField({
  name: 'lastName',
  validateOn: 'blur',
  isRequired: true,
});

export const email = createField({
  name: 'email',
  validateOn: 'blur',
  isRequired: true,
});

const user = createFieldset('user', [firstName, lastName]);

export const form = createFieldset('form', [user, email]);

form.value.watch((store) => console.log(store));
