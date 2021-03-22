import * as React from 'react';
import styled from 'styled-components';

import { FieldValidator } from 'lib/types';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error: ReturnType<FieldValidator>;
  onChange: () => unknown;
}

export const Input: React.FC<InputProps> = (props) => (
  <Wrapper>
    {props.error && <div>{props.error}</div>}
    <StyledInput type="text" {...props} />
  </Wrapper>
);

const Wrapper = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.42);
`;

const StyledInput = styled.input`
  width: 100%;
  border: 0;
  height: 1.1876em;
  margin: 0;
  display: block;
  padding: 6px 0 7px;
  min-width: 0;
  background: none;
  box-sizing: content-box;
  animation-name: mui-auto-fill-cancel;
  letter-spacing: inherit;
  animation-duration: 10ms;
  -webkit-tap-highlight-color: transparent;
  outline: none;
`;
