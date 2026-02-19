import { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className={`relative ${className}`}>
      <label
        className={`
          absolute left-4 transition-all duration-200 pointer-events-none
          ${focused || hasValue
            ? 'top-2 text-xs text-primary'
            : 'top-1/2 -translate-y-1/2 text-muted'
          }
        `}
      >
        {label} {required && <span className="text-error">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={focused ? placeholder : ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`
          w-full pt-5 pb-2 px-4 rounded-xl border-2 bg-white
          transition-all duration-200 outline-none
          ${error
            ? 'border-error focus:border-error'
            : 'border-border focus:border-primary'
          }
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-error">{error}</p>
      )}
    </div>
  );
}
