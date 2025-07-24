'use client'

import React from 'react'

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type }) => {

  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-black text-white py-2 rounded hover:opacity-90"
    >
      {label}
    </button>
  )
}

export default Button
