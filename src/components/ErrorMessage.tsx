import React from 'react';
import { Alert } from './UI';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
  onDismiss: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss
}) => {
  return (
    <Alert
      variant="error"
      message={error}
      onRetry={onRetry}
      onDismiss={onDismiss}
    />
  );
};

export default ErrorMessage;