import React from "react";
import { Trash2, X } from "lucide-react";

export interface IEquipmentExample {
  title: string;
  description?: string;
}

export interface IEquipmentItem {
  id: string;
  name: string;
  examples: IEquipmentExample;
}

export interface IExampleInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder?: string;
}

export function ExampleInput({
  value,
  onChange,
  onRemove,
  placeholder = "Add example equipment...",
}: IExampleInputProps): React.JSX.Element {
  return (
    <div className="relative flex items-stretch gap-0 overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 focus-within:border-green-500 focus-within:bg-white hover:border-gray-300">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent px-4 py-2 text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
        placeholder={placeholder}
        onClick={(e) => e.stopPropagation()}
        onFocus={(e) => e.stopPropagation()}
        aria-label="Equipment example"
      />

      <button
        type="button"
        onClick={onRemove}
        className="group cursor-pointer px-3 text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 focus:bg-red-50 focus:text-red-500 focus:outline-none"
        aria-label="Remove this example"
      >
        <X className="h-4 w-4 transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}
