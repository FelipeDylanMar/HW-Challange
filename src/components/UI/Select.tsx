import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  hasValue?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  placeholder,
  className = '',
  id,
  hasValue = false,
  value,
  ...props
}) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const isActive = hasValue || (value && value !== "");
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className={`block text-sm font-medium mb-1 transition-colors ${
          isActive ? 'text-blue-700' : 'text-gray-700'
        }`}>
          <span className="flex items-center gap-1">
            {isActive && (
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
            {label}
          </span>
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm bg-white transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : isActive 
                ? 'border-blue-400 bg-blue-50 shadow-md' 
                : 'border-gray-300 hover:border-gray-400'
            }
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {isActive && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Select;