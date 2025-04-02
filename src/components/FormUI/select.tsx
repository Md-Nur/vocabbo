"use client";

import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  errors?: { message?: string };
  options: { label?: string; value: string }[];
}

const Select = ({ label, errors, options, ...props }: SelectProps) => {
  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <select className="select select-bordered w-full" {...props}>
        <option disabled defaultValue="">
          Select an option
        </option>
        {options.map((option) => (
          <option
            className="capitalize"
            key={option.value}
            value={option.value}
          >
            {option?.label || option.value}
          </option>
        ))}
      </select>
      {errors?.message && (
        <label className="label">
          <span className="label-text-alt text-error">{errors.message}</span>
        </label>
      )}
    </div>
  );
};

export default Select;
