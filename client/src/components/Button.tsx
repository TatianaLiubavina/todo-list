import type { ReactNode } from "react";

interface ButtonProps {
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children: ReactNode;
}

const Button = (props: ButtonProps) => {
  const { className = "", type = "button", disabled = false, children } = props;

  return (
    <button className={`button ${className}`} type={type} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
