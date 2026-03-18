import type { FormEvent } from "react";

interface FieldProps {
  className?: string;
  id: string;
  label: string;
  type?: string;
  onInput: (event: FormEvent<HTMLInputElement>) => void;
  value: string;
}

const Field = (props: FieldProps) => {
  const { className = "", id, label, type = "text", onInput, value } = props;

  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <input
        className="field__input"
        id={id}
        placeholder=" "
        autoComplete="off"
        type={type}
        value={value}
        onInput={onInput}
      />
    </div>
  );
};

export default Field;
