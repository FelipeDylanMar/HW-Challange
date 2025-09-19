import React from 'react';
import type { SizeableProps, BaseComponentProps } from './types/common';
import { getSizeClasses, cn } from './utils/classNames';
import type { Size } from './types/common';

export type SpinnerSize = Size;

interface LoadingSpinnerProps extends BaseComponentProps, SizeableProps {
  text?: string;
  centered?: boolean;
  color?: 'primary' | 'secondary' | 'white';
  inline?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text,
  centered = false,
  color = 'primary',
  inline = false,
  ...props
}) => {
  const colorClasses = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white'
  };

  const spinnerClasses = cn(
    'animate-spin rounded-full border-b-2',
    colorClasses[color],
    getSizeClasses(size, 'icon'),
    className
  );

  const textClasses = cn(
    'text-gray-600 font-medium',
    getSizeClasses(size, 'text')
  );

  const spinner = <div className={spinnerClasses} {...props} />;

  if (inline) {
    return spinner;
  }

  if (text) {
    const content = (
      <div className="flex flex-col items-center space-y-2">
        {spinner}
        <span className={textClasses}>
          {text}
        </span>
      </div>
    );

    return centered ? (
      <div className="flex items-center justify-center p-6">
        {content}
      </div>
    ) : content;
  }

  return centered ? (
    <div className="flex items-center justify-center p-6">
      {spinner}
    </div>
  ) : spinner;
};

export default LoadingSpinner;