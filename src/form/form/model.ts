import { createEvent, createEffect } from 'effector';
import { createField, createFieldset, FieldValidatorParams } from '../lib';

export const onSubmit = createEvent('');

const lessThanThreeFx = createEffect<FieldValidatorParams, any, string>(({ value }) => {
  if (value.length > 3) return 'Ура успех';

  throw 'Введите больше 3-х символов';
});

const lessThanFiveFx = createEffect<FieldValidatorParams, any, string>(({ value }) => {
  if (value.length > 5) return Promise.resolve();

  return Promise.reject('Введите больше 5-ти символов');
});

lessThanFiveFx.failData.watch(error => console.log('Какая-то другая реакция на ошибку', error));
lessThanFiveFx.doneData.watch(done => console.log('Какая-то другая реакция на успех', done));
lessThanThreeFx.doneData.watch(done => console.log('Какая-то другая реакция на успех', done));

export const firstName = createField({
  name: 'firstName',
  validators: [
    lessThanThreeFx,
    lessThanFiveFx,
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
