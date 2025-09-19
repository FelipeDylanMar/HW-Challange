import React from 'react';
import type { StatusVariantProps, SizeableProps, BaseComponentProps } from './types/common';
import { getStatusBadgeClasses, cn } from './utils/classNames';
import type { StatusVariant, Size } from './types/common';

export type BadgeVariant = StatusVariant;
export type BadgeSize = Size;

interface StatusBadgeProps extends BaseComponentProps, StatusVariantProps, SizeableProps {
  /**
   * Content to display inside the badge
   */
  children: React.ReactNode;
  
  /**
   * Optional icon to display before the text
   */
  icon?: React.ReactNode;
  
  /**
   * Whether the badge should be clickable
   */
  clickable?: boolean;
  
  /**
   * Click handler for clickable badges
   */
  onClick?: () => void;
  
  /**
   * Whether to show a dot indicator
   */
  showDot?: boolean;
}

/**
 * StatusBadge component for displaying status information
 * Follows Clean Architecture principles with consistent styling
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
  clickable = false,
  onClick,
  showDot = false,
  ...props
}) => {
  const badgeClasses = cn(
    getStatusBadgeClasses(variant, size),
    clickable && 'cursor-pointer hover:opacity-80 transition-opacity',
    className
  );

  const handleClick = () => {
    if (clickable && onClick) {
      onClick();
    }
  };

  return (
    <span
      className={badgeClasses}
      onClick={handleClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      } : undefined}
      {...props}
    >
      {showDot && (
        <span className="w-2 h-2 bg-current rounded-full mr-1.5 flex-shrink-0" />
      )}
      
      {icon && (
        <span className="mr-1.5 flex-shrink-0">
          {icon}
        </span>
      )}
      
      <span className="truncate">
        {children}
      </span>
    </span>
  );
};

export default StatusBadge;