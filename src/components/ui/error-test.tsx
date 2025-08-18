import React, { useState } from 'react';
import { Button } from './button';

interface ErrorTestProps {
  type: 'render' | 'event' | 'async' | 'state';
}

export const ErrorTest: React.FC<ErrorTestProps> = ({ type }) => {
  const [shouldThrow, setShouldThrow] = useState(false);

  // Simulate different types of errors
  if (type === 'render' && shouldThrow) {
    throw new Error('Render Error: This is a simulated render error');
  }

  const handleEventError = () => {
    throw new Error('Event Error: This is a simulated event handler error');
  };

  const handleAsyncError = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    throw new Error('Async Error: This is a simulated async error');
  };

  const handleStateError = () => {
    setShouldThrow(true);
  };

  return (
    <div className="p-4 border border-slate-600 rounded-lg bg-slate-800">
      <h3 className="text-lg font-semibold mb-4">Error Test Component - {type}</h3>
      
      {type === 'render' && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">
            This component will throw a render error when the button is clicked.
          </p>
          <Button onClick={handleStateError} variant="destructive">
            Trigger Render Error
          </Button>
        </div>
      )}

      {type === 'event' && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">
            This component will throw an error in an event handler.
          </p>
          <Button onClick={handleEventError} variant="destructive">
            Trigger Event Error
          </Button>
        </div>
      )}

      {type === 'async' && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">
            This component will throw an error in an async function.
          </p>
          <Button onClick={handleAsyncError} variant="destructive">
            Trigger Async Error
          </Button>
        </div>
      )}

      {type === 'state' && (
        <div className="space-y-2">
          <p className="text-sm text-slate-400">
            This component will throw an error when state changes.
          </p>
          <Button onClick={handleStateError} variant="destructive">
            Trigger State Error
          </Button>
        </div>
      )}

      <div className="mt-4 p-2 bg-slate-700 rounded text-xs">
        <p>Component Type: {type}</p>
        <p>Should Throw: {shouldThrow.toString()}</p>
      </div>
    </div>
  );
};
