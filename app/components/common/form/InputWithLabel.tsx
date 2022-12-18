import {HTMLInputTypeAttribute} from "react";

type InputProps = {
  id: string;
  type: HTMLInputTypeAttribute | undefined;
  name: string;
  defaultValue?: string;
  label: string;
  required?: boolean | undefined;
  disabled?: boolean | undefined;
  error?: string | null
};

const InputWithLabel = (props: InputProps) => {
  const { id, name, label, type, required, disabled, defaultValue, error } = props;
  return (
    <div className={"flex w-full flex-col gap-2"}>
      <label className={"font-default-medium text-gray-600"} htmlFor={name}>
        {label}
      </label>
      <input
        className={"rounded-xl border-none bg-gray-50 p-3 font-default-semibold outline-none ring ring-1 ring-indigo-100 "}
        type={type}
        defaultValue={defaultValue}
        id={id}
        name={name}
        required={required}
        disabled={disabled}
      />
        {error ? (
            <em className="text-red-600">{error}</em>
        ) : null}
    </div>
  );
};

export default InputWithLabel;
