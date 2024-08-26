import React from 'react';

interface TextAreaFieldProps {
  label: string;
  value: string;
  description?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  maxLength?: number;
  required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  label,
  description,
  value,
  onChange,
  placeholder,
  maxLength,
  required,
}) => (
  <div className="mb-2">
    <h3 className="font-semibold p-1 text-left">
      {label} {required && <span className="text-[#24583C]">*</span>}
    </h3>
    <p className='text-sm text-[#B5B5B6] pl-1 mb-2'>{description}</p>
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
