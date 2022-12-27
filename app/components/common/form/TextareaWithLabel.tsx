import React from "react";
import _ from 'lodash'

type InputProps = {
  id: string;
  name: string;
  defaultValue?: string;
  label: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;

  onChange?: (value: string) => void
};

const TextAreaWithLabel = (props: InputProps) => {
  const { id, name, label, required, disabled, defaultValue, onChange } = props;
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
          onChange(event.target.value)
      }
  }

  return (
    <div className={"flex w-full flex-col gap-2"}>
      <label className={"font-default-medium text-gray-600"} htmlFor={name}>
        {label}
      </label>
      <textarea
        className={"rounded-xl border-none bg-gray-50 p-3 font-default-semibold outline-none ring ring-1 ring-indigo-100 "}
        defaultValue={defaultValue}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
        onChange={_.debounce(handleChange, 500)}
      />
    </div>
  );
};

export default TextAreaWithLabel;
