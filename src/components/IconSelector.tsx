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
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => setValue(option.label)}
            className="rounded-full border border-gray-200 p-2 transition hover:bg-blueLight"
          >
            <Image src={option.src} alt={option.label} width={32} height={32} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default IconSelector;
