import * as React from 'react';

import { FieldValidator } from 'lib/types';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error: ReturnType<FieldValidator>;
  label?: string;
  onChange: () => unknown;
}

export const Checkbox: React.FC<InputProps> = (props) => (
  <div>
    {props.error && <div>{props.error}</div>}
    <label>
      <input type="checkbox" {...props} /> {props.label}
    </label>
  </div>
);
