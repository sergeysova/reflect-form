import { Store, forward, Domain, createDomain, fork } from 'effector';
import { Fieldset, BaseField, createFieldsetEntity, createCheckbox, createInput } from './index';

function createTestableFieldset(
  name: string,
  fields: BaseField<any>[],
  domain: Domain = createDomain(),
): Fieldset<{ [key: string]: Store<any> }> {
  const values = domain.createStore<{ [key: string]: any }>({});

  for (const field of fields) {
    values.on(field.value, (state, value) => {
      if (state[field.name] === value) {
        return state;
      }

      return {
        ...state,
        [field.name]: value,
      };
    });

    forward({
      from: values.map((data) => data[field.name]),
      to: field.handlers.onChange,
    });
  }

  const fieldSet = createFieldsetEntity({ name, initialValue: values });

  forward({
    from: fieldSet.triggers.reset,
    to: fields.map((field) => field.triggers.reset),
  });

  return {
    ...fieldSet,
    value: values,
  };
}

test('there is ability to create custom fieldset and test it independently from fields', () => {
  const domain = createDomain();

  const firstname = createInput({ name: 'firstname' });
  const lastname = createInput({ name: 'lastname' });
  const adult = createCheckbox({ name: 'adult' });

  const form = createTestableFieldset('form', [firstname, lastname, adult], domain);

  const scope = fork(domain, {
    values: new Map().set(form.value, {
      firstname: 'John',
      lastname: 'Doe',
      adult: true,
    }),
  });

  expect(scope.getState(form.value)).toEqual({ firstname: 'John', lastname: 'Doe', adult: true });
});
