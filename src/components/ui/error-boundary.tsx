import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 rounded-lg border border-slate-700 p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-400" />
            </div>
            
            <h1 className="text-xl font-bold text-slate-200 mb-2">
              Something went wrong
            </h1>
            
            <p className="text-slate-400 mb-6">
              An unexpected error occurred. Don't worry, your work is safe.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-4 text-left">
                <summary className="text-slate-300 cursor-pointer text-sm">
                  Error details (dev mode)
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-slate-900 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={this.handleGoHome} size="sm">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to catch errors
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Error caught by hook:', error, errorInfo);
    // You could send this to an error reporting service here
  };
}
