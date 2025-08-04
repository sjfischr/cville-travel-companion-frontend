// Example usage:
// <Input type="email" size="lg" value={email} onChange={setEmail} />
// <Input type="text" size="md" value={name} onChange={setName} error="Name is required" />

import React from 'react';

interface InputProps {
  type: 'text' | 'email' | 'number';
  size: 'sm' | 'md' | 'lg';
  error?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  id?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type,
  size,
  error,
  value,
  onChange,
  placeholder,
  id,
  label,
  className = '',
  disabled = false,
  required = false,
}) => {
  const baseClasses = 'w-full border rounded-lg bg-input-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  
  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-10',
    lg: 'h-11 text-base',
  };
  
  const errorClasses = error ? 'border-destructive focus:ring-destructive' : 'border-border';
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${errorClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-2">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={classes}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};