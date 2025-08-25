import React from 'react';

type Props = {
  label: string;
  primary?: boolean;
  backgroundColor?: string;
};

export const Button: React.FC<Props> = ({ label }) => (
  <button className="depth-btn">
    {label}
  </button>
);
