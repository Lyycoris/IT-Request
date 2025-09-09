import React, { useState, useRef, useEffect } from 'react';
import { Input } from './Input';

interface ComboBoxProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export const ComboBox: React.FC<ComboBoxProps> = ({ options, value, onChange, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Menutup dropdown saat klik di luar komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(value.toLowerCase())
  );

  const handleSelectOption = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <Input
        type="text"
        value={value}
        onChange={(e) => {
            onChange(e.target.value);
            if (!isOpen) setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      />
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          <ul role="listbox">
            {filteredOptions.map((option, index) => (
              <li
                key={index}
                className="text-gray-900 cursor-pointer select-none relative py-2 px-4 hover:bg-gray-100"
                onClick={() => handleSelectOption(option)}
                role="option"
                aria-selected={value === option}
              >
                <span className="font-normal block truncate">{option}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
