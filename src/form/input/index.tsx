import * as React from 'react';

import { FieldValidator } from '../lib/types';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error: ReturnType<FieldValidator>;
  onChange: () => unknown;
}

export const Input: React.FC<InputProps> = (props) => (
  <div>
    {props.error && <div>{props.error}</div>}
    <input type="text" {...props} />
  </div>
);
