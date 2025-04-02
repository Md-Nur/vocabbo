"use client";
import { InputHTMLAttributes, ReactNode } from "react";
import Label from "./label";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  children?: ReactNode;
  label?: string;
  errors?: any;
  placeholder?: string;
  type?: string;
}

const Input = (props: InputProps) => {
  return (
    <div className="form-control">
      <label className="input input-accent">
        <span className="label label-text">{props.label}</span>
        <input placeholder={props?.placeholder} {...props} />
      </label>
      {props.errors && (
        <p className="mt-1 text-sm text-red-500">{props.errors.message}</p>
      )}
    </div>
  );
};

export default Input;
