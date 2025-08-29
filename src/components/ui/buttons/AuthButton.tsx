'use client'

import React from 'react'

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  type: 'button' | 'submit' | 'reset';
  loading?: boolean
}

const Button: React.FC<ButtonProps> = ({ label, onClick, type, loading }) => {

  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-black text-white py-2 rounded hover:opacity-90"
      disabled={loading || false}
    >
      {loading ? 'Loading...' : label}
    </button>
  )
}

export default Button
