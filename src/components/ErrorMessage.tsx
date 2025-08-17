import React from 'react';
import { AlertCircleIcon } from 'lucide-react';
type ErrorMessageProps = {
  message: string;
};
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message
}) => {
  return <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded">
      <div className="flex items-center">
        <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700">{message}</p>
      </div>
    </div>;
};