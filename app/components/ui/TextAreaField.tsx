import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  maxLength?: number;
  required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  required,
}) => (
  <div className="mb-2">
    <h3 className="font-semibold p-2 text-center">
      {label} <span className="tooltip tooltip-top" data-tip="Required"><FaInfoCircle className="inline ml-2 text-blue-500 relative" style={{ top: '-2px' }} /></span>
    </h3>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-20 w-full p-2 border border-gray-800 rounded-md"
      required={required}
      maxLength={maxLength}
    />
    {maxLength && (
      <div className="text-right mr-2">{value.length}/{maxLength}</div>
    )}
  </div>
);

export default TextAreaField;
