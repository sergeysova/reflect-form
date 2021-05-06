import { createEvent } from 'effector';
import { ChangeEvent } from 'react';

import { Events, Triggers } from './types';

export function createTriggers(name: string): Triggers {
  const onValidate = createEvent<void>(`${name}ValidationTriggered`);
  const onForceValidate = createEvent<void>(`${name}ForceValidationTriggered`);
  const onReset = createEvent<void>(`${name}Reset`);
  const onValueSet = createEvent<void>(`${name}SetValue`);

  return {
    onValidate,
    onForceValidate,
    onReset,
    onValueSet,
  };
}

export function createEvents(name: string): Events {
  const onChanged = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Changed`);
  const onFocused = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Focused`);
  const onBlurred = createEvent<ChangeEvent<HTMLInputElement>>(`${name}Blurred`);
  const onTouched = createEvent<void>(`${name}Touched`);

  return {
    onChanged,
    onFocused,
    onBlurred,
    onTouched,
  };
}
