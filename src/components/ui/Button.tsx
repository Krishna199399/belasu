import React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Unified Button Component
 * 
 * Variants:
 * - primary: Main action buttons (amber/orange)
 * - secondary: Secondary actions (indigo/blue)
 * - outline: Border-only buttons
 * - ghost: Transparent background
 * - danger: Destructive actions (red)
 * 
 * Sizes:
 * - sm: Small (py-2 px-3.5, text-xs)
 * - md: Medium (py-2.5 px-5, text-sm) - default
 * - lg: Large (py-3.5 px-7, text-base)
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 focus:ring-amber-500',
    secondary: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/20 focus:ring-indigo-500',
    outline: 'bg-white border-2 border-slate-200 hover:border-amber-400 text-slate-700 hover:text-amber-600 focus:ring-amber-400',
    ghost: 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 focus:ring-slate-400',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 focus:ring-red-500',
  };

  const sizes = {
    sm: 'py-2 px-3.5 text-xs',
    md: 'py-2.5 px-5 text-sm',
    lg: 'py-3.5 px-7 text-base',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        widthClass,
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Badge variant for small tags/labels (not interactive)
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'indigo' | 'emerald' | 'rose' | 'slate';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'amber',
  className 
}) => {
  const variants = {
    amber: 'bg-amber-100 text-amber-800 border-amber-300',
    indigo: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    rose: 'bg-rose-100 text-rose-800 border-rose-300',
    slate: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

// Icon button variant for small icon-only actions
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-600',
    primary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20',
    ghost: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  };

  const sizes = {
    sm: 'p-2',
    md: 'p-2.5',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
