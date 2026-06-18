import { useEffect, useRef, useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export function SearchInput({ placeholder, value, onChange, debounceMs = 300 }: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const handle = setTimeout(() => onChangeRef.current(localValue), debounceMs);
    return () => clearTimeout(handle);
  }, [localValue, debounceMs]);

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={localValue}
      onChange={(event) => setLocalValue(event.target.value)}
      className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
    />
  );
}
