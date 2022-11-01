import type { ChangeEvent } from "react";

interface FormFieldProps {
  htmlFor: string
  label: string
  type?: string
  value: string | number | readonly string[] | undefined
  onChange?: (event: ChangeEvent<HTMLInputElement>) => unknown
}

export function FormField({ htmlFor, label, type = 'text', value, onChange = () => {} }: FormFieldProps) {
  return (
    <>
      <label htmlFor={htmlFor} className="text-blue-600 font-semibold">
        {label}
      </label>
      <input
        onChange={onChange}
        type={type}
        id={htmlFor}
        name={htmlFor}
        className="w-full p-2 rounded-xl my-2"
        value={value}
      />
    </>
  )
}