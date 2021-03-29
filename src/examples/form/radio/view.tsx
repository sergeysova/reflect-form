import * as React from 'react';

import { FieldValidator } from 'lib/types';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error: ReturnType<FieldValidator>;
  label?: string;
  onChange: () => unknown;
}

export const Radio: React.FC<InputProps> = (props) => (
  <div>
    {props.error && <div>{props.error}</div>}
    <label>
      <input type="radio" {...props} /> {props.label}
    </label>
  </div>
);
