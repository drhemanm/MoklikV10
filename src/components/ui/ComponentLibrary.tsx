// src/components/ui/ComponentLibrary.tsx
import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

// ==========================================
// TYPOGRAPHY SYSTEM
// ==========================================

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export const Typography = {
  H1: ({ children, className = '' }: TypographyProps) => (
    <h1 className={`text-3xl md:text-4xl font-bold text-gray-900 tracking-tight ${className}`}>
      {children}
    </h1>
  ),
  H2: ({ children, className = '' }: TypographyProps) => (
    <h2 className={`text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight ${className}`}>
      {children}
    </h2>
  ),
  H3: ({ children, className = '' }: TypographyProps) => (
    <h3 className={`text-xl md:text-2xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  ),
  H4: ({ children, className = '' }: TypographyProps) => (
    <h4 className={`text-lg md:text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h4>
  ),
  Body: ({ children, className = '' }: TypographyProps) => (
    <p className={`text-base text-gray-700 leading-relaxed ${className}`}>
      {children}
    </p>
  ),
  BodyLarge: ({ children, className = '' }: TypographyProps) => (
    <p className={`text-lg text-gray-700 leading-relaxed ${className}`}>
      {children}
    </p>
  ),
  BodySmall: ({ children, className = '' }: TypographyProps) => (
    <p className={`text-sm text-gray-600 leading-relaxed ${className}`}>
      {children}
    </p>
  ),
  Caption: ({ children, className = '' }: TypographyProps) => (
    <span className={`text-xs text-gray-500 font-medium ${className}`}>
      {children}
    </span>
  ),
  Label: ({ children, className = '' }: TypographyProps) => (
    <label className={`text-sm font-medium text-gray-900 ${className}`}>
      {children}
    </label>
  )
};

// ==========================================
// BUTTON SYSTEM
// ==========================================

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className = ''
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md focus:ring-blue-500',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 shadow-sm hover:shadow-md focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500',
    destructive: 'bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500',
    outline: 'bg-white border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md focus:ring-gray-500'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-2.5 text-base gap-2',
    xl: 'px-8 py-3 text-lg gap-3'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {Icon && iconPosition === 'left' && !loading && <Icon className="h-4 w-4" />}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon className="h-4 w-4" />}
    </button>
  );
};

// ==========================================
// CARD SYSTEM
// ==========================================

interface CardProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Card = ({
  children,
  variant = 'elevated',
  padding = 'md',
  hover = false,
  clickable = false,
  onClick,
  className = ''
}: CardProps) => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-200';
  
  const variantClasses = {
    elevated: 'shadow-sm border border-gray-100',
    outlined: 'border-2 border-gray-200',
    flat: 'border border-gray-100'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };
  
  const interactiveClasses = hover || clickable ? 'hover:shadow-lg hover:shadow-gray-200/50 hover:-translate-y-0.5' : '';
  const cursorClass = clickable ? 'cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${cursorClass} ${className}`}
    >
      {children}
    </div>
  );
};

// ==========================================
// INPUT SYSTEM
// ==========================================

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  error?: string;
  helpText?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const Input = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  helpText,
  icon: Icon,
  disabled = false,
  required = false,
  className = ''
}: InputProps) => {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg transition-colors duration-200
    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:opacity-50 disabled:cursor-not-allowed
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-blue-500'
    }
    ${Icon ? 'pl-10' : ''}
  `;
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <Typography.Label className={required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}>
          {label}
        </Typography.Label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          className={inputClasses}
        />
      </div>
      {error && (
        <Typography.Caption className="text-red-600">
          {error}
        </Typography.Caption>
      )}
      {helpText && !error && (
        <Typography.Caption>
          {helpText}
        </Typography.Caption>
      )}
    </div>
  );
};

// ==========================================
// BADGE SYSTEM
// ==========================================

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: BadgeProps) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-orange-100 text-orange-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
};

// ==========================================
// PROGRESS SYSTEM
// ==========================================

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export const Progress = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  label,
  className = ''
}: ProgressProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const variantClasses = {
    default: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-orange-600',
    error: 'bg-red-600'
  };
  
  return (
    <div className={`space-y-1 ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center">
          <Typography.Caption>{label || 'Progress'}</Typography.Caption>
          {showLabel && (
            <Typography.Caption>{Math.round(percentage)}%</Typography.Caption>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${variantClasses[variant]} ${sizeClasses[size]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ==========================================
// STAT CARD COMPONENT
// ==========================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className = ''
}: StatCardProps) => {
  const variantClasses = {
    default: 'border-gray-200',
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-orange-200 bg-orange-50/50',
    error: 'border-red-200 bg-red-50/50',
    info: 'border-blue-200 bg-blue-50/50'
  };
  
  return (
    <Card variant="outlined" padding="lg" className={`${variantClasses[variant]} ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Typography.Caption className="text-gray-600 uppercase tracking-wider">
            {title}
          </Typography.Caption>
          <Typography.H3 className="mt-1">
            {value}
          </Typography.H3>
          {subtitle && (
            <Typography.BodySmall className="mt-1">
              {subtitle}
            </Typography.BodySmall>
          )}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="font-medium">
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="ml-1 text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-lg ${
            variant === 'default' ? 'bg-blue-100' :
            variant === 'success' ? 'bg-green-100' :
            variant === 'warning' ? 'bg-orange-100' :
            variant === 'error' ? 'bg-red-100' :
            'bg-blue-100'
          }`}>
            <Icon className={`h-6 w-6 ${
              variant === 'default' ? 'text-blue-600' :
              variant === 'success' ? 'text-green-600' :
              variant === 'warning' ? 'text-orange-600' :
              variant === 'error' ? 'text-red-600' :
              'text-blue-600'
            }`} />
          </div>
        )}
      </div>
    </Card>
  );
};

// ==========================================
// ACTION CARD COMPONENT
// ==========================================

interface ActionCardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const ActionCard = ({
  title,
  description,
  icon: Icon,
  iconColor = 'text-blue-600',
  iconBg = 'bg-blue-100',
  action,
  className = ''
}: ActionCardProps) => {
  return (
    <Card 
      variant="elevated" 
      padding="lg" 
      hover={!!action}
      clickable={!!action}
      onClick={action?.onClick}
      className={className}
    >
      <div className="flex items-start space-x-4">
        {Icon && (
          <div className={`p-3 rounded-lg ${iconBg} flex-shrink-0`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Typography.H4 className="mb-2">
            {title}
          </Typography.H4>
          <Typography.BodySmall className="text-gray-600 mb-4">
            {description}
          </Typography.BodySmall>
          {action && (
            <Typography.BodySmall className="text-blue-600 font-medium">
              {action.label} →
            </Typography.BodySmall>
          )}
        </div>
      </div>
    </Card>
  );
};
