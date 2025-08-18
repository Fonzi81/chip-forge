import React from 'react';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ErrorTest } from '@/components/ui/error-test';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundaryTest() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Error Boundary Testing</h1>
          <p className="text-slate-400">
            Test the error boundaries to ensure they catch errors properly and provide good user experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Test 1: Render Error */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Render Error Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                This component will throw an error during render when triggered.
              </p>
              <ErrorBoundary>
                <ErrorTest type="render" />
              </ErrorBoundary>
            </CardContent>
          </Card>

          {/* Test 2: Event Handler Error */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Event Handler Error Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                This component will throw an error in an event handler.
              </p>
              <ErrorBoundary>
                <ErrorTest type="event" />
              </ErrorBoundary>
            </CardContent>
          </Card>

          {/* Test 3: Async Error */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Async Error Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                This component will throw an error in an async function.
              </p>
              <ErrorBoundary>
                <ErrorTest type="async" />
              </ErrorBoundary>
            </CardContent>
          </Card>

          {/* Test 4: State Change Error */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                State Change Error Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-4">
                This component will throw an error when state changes.
              </p>
              <ErrorBoundary>
                <ErrorTest type="state" />
              </ErrorBoundary>
            </CardContent>
          </Card>
        </div>

        {/* Test 5: Nested Error Boundaries */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Nested Error Boundaries Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-4">
              Test nested error boundaries - outer boundary should catch errors from inner components.
            </p>
            <div className="space-y-4">
              <ErrorBoundary>
                <div className="p-4 border border-slate-600 rounded bg-slate-700">
                  <h4 className="font-semibold mb-2">Outer Error Boundary</h4>
                  <ErrorBoundary>
                    <div className="p-3 border border-slate-500 rounded bg-slate-600">
                      <h5 className="font-medium mb-2">Inner Error Boundary</h5>
                      <ErrorTest type="render" />
                    </div>
                  </ErrorBoundary>
                </div>
              </ErrorBoundary>
            </div>
          </CardContent>
        </Card>

        {/* Test 6: Custom Fallback */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Custom Fallback Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-4">
              Test error boundary with custom fallback UI.
            </p>
            <ErrorBoundary
              fallback={
                <div className="p-6 border-2 border-dashed border-red-400 rounded-lg text-center">
                  <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-400 mb-2">
                    Custom Error Fallback
                  </h3>
                  <p className="text-slate-400 mb-4">
                    This is a custom error fallback UI that replaces the default error boundary.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Custom Retry
                    </Button>
                    <Button size="sm">
                      <Home className="h-4 w-4 mr-2" />
                      Custom Home
                    </Button>
                  </div>
                </div>
              }
            >
              <ErrorTest type="render" />
            </ErrorBoundary>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-slate-700 rounded">
                <strong>1. Render Error:</strong> Click "Trigger Render Error" to test error boundary catching render errors
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <strong>2. Event Handler Error:</strong> Click "Trigger Event Error" to test error boundary catching event handler errors
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <strong>3. Async Error:</strong> Click "Trigger Async Error" to test error boundary catching async errors
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <strong>4. State Change Error:</strong> Click "Trigger State Error" to test error boundary catching state change errors
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <strong>5. Nested Boundaries:</strong> Test that nested error boundaries work correctly
              </div>
              <div className="p-3 bg-slate-700 rounded">
                <strong>6. Custom Fallback:</strong> Test custom error fallback UI
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
