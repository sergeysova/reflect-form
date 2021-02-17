import * as React from 'react';

type SelectOptionProps = React.OptionHTMLAttributes<HTMLOptionElement>;

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  isDisabled?: boolean;
  options: SelectOptionProps[];
  onChange: () => unknown;
  onBlur: () => unknown;
  onFocus: () => unknown;
}

const SelectOption: React.FC<SelectOptionProps> = ({ value, label, selected, disabled }) => (
  <option value={value} selected={selected} disabled={disabled}>
    {label}
  </option>
);

const SelectOptions: React.FC<{ options: SelectOptionProps[] }> = ({ options }) => (
  <>
    {options.map((option) => (
      <SelectOption
        key={option.value as string}
        value={option.value}
        label={option.label}
        disabled={option.disabled}
        {...option}
      />
    ))}
  </>
);

export const Select: React.FC<SelectProps> = ({
  name,
  onBlur,
  onFocus,
  onChange,
  defaultValue,
  isDisabled,
  options,
  ...props
}) => (
  <select
    name={name}
    onBlur={onBlur}
    onFocus={onFocus}
    onChange={onChange}
    defaultValue={defaultValue}
    disabled={isDisabled}
    {...props}
  >
    <SelectOptions options={options} />
  </select>
);
