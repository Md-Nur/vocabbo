"use client";
import { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errors?: { message?: string };
}

const Input = ({ label, errors, ...props }: InputProps) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text capitalize">{label}</span>
        </label>
      )}
      <input className="input input-bordered w-full input-accent" {...props} />
      {errors?.message && (
        <label className="label">
          <span className="label-text-alt text-error">{errors.message}</span>
        </label>
      )}
    </div>
  );
};

export default Input;
