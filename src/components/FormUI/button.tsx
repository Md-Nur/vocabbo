"use client";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  type?: "submit" | "button";
}

const Button = ({ children, isLoading, type, ...props }: ButtonProps) => {
  return (
    <button
      className="btn btn-accent uppercase"
      {...props}
      type={type || "submit"}
      disabled={isLoading}
    >
      {children}
      {isLoading && <span className="loading loading-spinner"></span>}
    </button>
  );
};

export default Button;
