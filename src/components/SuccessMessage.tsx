import React from 'react';
import { Alert } from './UI';

interface SuccessMessageProps {
  message: string;
  onDismiss: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onDismiss
}) => {
  return (
    <Alert
      variant="success"
      message={message}
      onDismiss={onDismiss}
    />
  );
};

export default SuccessMessage;