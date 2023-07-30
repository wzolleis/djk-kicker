import {PropsWithChildren} from "react";

type InputProps = {
  id: string;
  name: string;
  defaultValue?: string;
  label: string;
  onChange?: any;
};

const SelectWithLabel = ({id, name, label, defaultValue, children, onChange}: PropsWithChildren<InputProps>) => {
  return (
    <div className={"flex w-full flex-col gap-2"}>
      <label className={"font-default-medium text-gray-600"} htmlFor={name}>
        {label}
      </label>
      <select
          className={"rounded-xl border-none bg-gray-50 p-3 font-default-semibold outline-none ring-1 ring-indigo-100"}
        defaultValue={defaultValue}
        id={id}
        name={name}
        onChange={onChange}>
        {children}
      </select>
    </div>
  );
};

export default SelectWithLabel;
