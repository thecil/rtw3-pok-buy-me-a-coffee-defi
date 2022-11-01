import React from "react";

interface PrimaryButtonProps extends React.ComponentPropsWithRef<"button"> {
  text: string;
  disabled?: boolean;
}

export const ButtonPrimary: React.FC<PrimaryButtonProps> = ({
  text,
  disabled = false,
  ...props
}) => {
  return (
    <button
      className={disabled ? `disabled` : `text-white bg-green-400 rounded px-2 w-24 self-center hover:bg-green-600`}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
};