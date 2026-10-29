import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-8 sm:p-10 text-center max-w-lg mx-auto space-y-4 shadow-sm">
      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mx-auto">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold font-heading text-rose-950">
          Something went wrong
        </h3>
        <p className="text-sm text-rose-800 leading-relaxed">
          {errorMessage || 'Unable to process culinary request. Please check your inputs and try again.'}
        </p>
      </div>

      <button
        id="error-retry-btn"
        onClick={onRetry}
        className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  );
};
