import React from 'react';
import Icon from './Icon';

export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  message: string;
  onDismiss: () => void;
  onRetry?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  message,
  onDismiss,
  onRetry,
  className = ''
}) => {
  const variantConfig = {
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-700',
      iconColor: 'text-red-400',
      buttonBg: 'bg-red-100',
      buttonText: 'text-red-700',
      buttonHover: 'hover:bg-red-200',
      icon: 'error' as const
    },
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-700',
      iconColor: 'text-green-400',
      buttonBg: 'bg-green-100',
      buttonText: 'text-green-700',
      buttonHover: 'hover:bg-green-200',
      icon: 'success' as const
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-700',
      iconColor: 'text-yellow-400',
      buttonBg: 'bg-yellow-100',
      buttonText: 'text-yellow-700',
      buttonHover: 'hover:bg-yellow-200',
      icon: 'exclamation-circle' as const
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      iconColor: 'text-blue-400',
      buttonBg: 'bg-blue-100',
      buttonText: 'text-blue-700',
      buttonHover: 'hover:bg-blue-200',
      icon: 'info' as const
    }
  };

  const config = variantConfig[variant];

  return (
    <div className={`mb-4 p-4 ${config.bgColor} border ${config.borderColor} rounded-lg flex items-center ${className}`}>
      <Icon 
        name={config.icon} 
        className={`${config.iconColor} mr-3`} 
      />
      <span className={`${config.textColor} flex-1`}>{message}</span>
      
      {onRetry && variant === 'error' && (
        <button
          onClick={onRetry}
          className={`mr-3 px-3 py-1 text-sm ${config.buttonBg} ${config.buttonText} rounded ${config.buttonHover} transition-colors`}
        >
          Tentar novamente
        </button>
      )}
      
      <button
        onClick={onDismiss}
        className={`${config.iconColor} hover:opacity-75 transition-opacity`}
      >
        <Icon name="close" size="sm" />
      </button>
    </div>
  );
};

export default Alert;