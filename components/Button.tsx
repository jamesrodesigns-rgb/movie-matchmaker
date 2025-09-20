import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = '',
  type = 'button',
}) => {
  // Base button styles
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium tracking-button uppercase
    text-label
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-bg-primary
    disabled:opacity-disabled disabled:cursor-not-allowed
    ${disabled ? 'pointer-events-none' : 'cursor-pointer'}
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      bg-accent-primary text-button-label
      hover:bg-accent-primary-hover
      active:scale-95
    `,
    secondary: `
      bg-bg-tertiary text-text-primary border border-surface-40
      hover:bg-surface-30 hover:border-surface-30
      active:scale-95
    `,
    tertiary: `
      bg-transparent text-text-primary border border-text-secondary
      hover:bg-surface-20 hover:border-text-primary
      active:scale-95
    `,
    ghost: `
      bg-transparent text-accent-primary
      hover:bg-surface-20
      active:scale-95
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 rounded-sm text-chip-bold',
    md: 'px-[30px] py-3 rounded-xl',
    lg: 'px-8 py-4 rounded-xl text-h3',
  };

  const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={combinedClassName}
    >
      {children}
    </button>
  );
};

// Export button variants for convenience
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const TertiaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="tertiary" />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="ghost" />
);