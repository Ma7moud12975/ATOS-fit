import React from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const ErrorMessage = ({ error, title = 'Error' }) => {
  if (!error) return null;

  const errorMessage = typeof error === 'string' ? error : error.message || 'An unexpected error occurred';

  return (
    <Alert variant="destructive" className="my-4">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  );
};

export default ErrorMessage;
