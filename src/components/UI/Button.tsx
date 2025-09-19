import React from 'react';
import { type ButtonLikeProps } from './types/common';
import { getButtonClasses, cn } from './utils/classNames';
import LoadingSpinner from './LoadingSpinner';

/**
 * Button component following Clean Architecture principles
 * Supports multiple variants, sizes, and loading states
 */
interface ButtonProps extends ButtonLikeProps {
  /**
   * Content to display inside the button
   */
  children: React.ReactNode;
  
  /**
   * Whether to show loading spinner and disable interaction
   */
  isLoading?: boolean;
  
  /**
   * Icon to display before the button text
   */
  startIcon?: React.ReactNode;
  
  /**
   * Icon to display after the button text
   */
  endIcon?: React.ReactNode;
  
  /**
   * Whether the button should take full width of its container
   */
  fullWidth?: boolean;
}

/**
 * Reusable Button component with consistent styling and behavior
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className,
  disabled,
  startIcon,
  endIcon,
  fullWidth = false,
  ...props
}) => {
  const isDisabled = disabled || isLoading;
  
  const buttonClasses = cn(
    getButtonClasses(variant, size, isDisabled),
    fullWidth && 'w-full',
    className
  );
  
  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {isLoading && (
        <LoadingSpinner 
          size={size === 'lg' ? 'md' : 'sm'} 
          className="-ml-1 mr-2" 
        />
      )}
      
      {!isLoading && startIcon && (
        <span className="mr-2 flex-shrink-0">
          {startIcon}
        </span>
      )}
      
      <span className={cn(isLoading && 'opacity-75')}>
        {children}
      </span>
      
      {!isLoading && endIcon && (
        <span className="ml-2 flex-shrink-0">
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default Button;