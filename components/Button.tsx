import React from "react";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, onClick, ...props }) => {
  return (
    <button
      className={`bg-[#7559FF] text-white text-sm px-6 py-2 rounded-lg disabled:opacity-50 h-fit min-h-[44px] flex items-center justify-center ${className}`}
      onClick={props.disabled ? undefined : onClick}
      {...props}
    >
      {children}
    </button>
  );
};
