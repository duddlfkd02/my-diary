"use client";

import Image from "next/image";

interface IconOption {
  label: string;
  src: string;
}

interface IconSelectorProps {
  title?: string;
  value: string;
  setValue: (val: string) => void;
  options: IconOption[];
}

const IconSelector = ({ title, value, setValue, options }: IconSelectorProps) => {
  return (
    <div>
      <span>{title}</span>
      <div>
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => setValue(option.label)}
            className={`h-10 w-10 rounded-full border ${value === option.label ? "ring-blue-500 ring-2" : ""}`}
          >
            <Image src={option.src} alt={option.label} width={40} height={40} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconSelector;
