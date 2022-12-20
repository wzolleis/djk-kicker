import React from "react";

type InputProps = {
  id: string;
  name: string;
  defaultValue?: string;
  label: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  onChange?: any;
};

const TextAreaWithLabel = (props: InputProps) => {
  const { id, name, label, required, disabled, defaultValue, onChange } = props;
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
        disabled={disabled}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
      />
    </div>
  );
};

export default TextAreaWithLabel;
