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
      className={disabled ? `disabled` : `text-neutral-200 bg-green-500 rounded px-2 w-24 self-center hover:bg-green-800`}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
};