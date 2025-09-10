import React from 'react';
import { XCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex items-center gap-2 p-4 bg-red-50 text-red-600 rounded-lg">
      <XCircle size={20} />
      <span>{message}</span>
    </div>
  );
}