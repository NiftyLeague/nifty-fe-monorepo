import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@nl/ui/base/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@nl/ui/base/card';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * A reusable ErrorBoundary component for gracefully handling errors in child components.
 * It catches errors during rendering, in lifecycle methods, and in constructors of components
 * below it in the tree, and displays a fallback UI instead of crashing the entire application.
 *
 * This component is a class component because the componentDidCatch lifecycle method
 * and getDerivedStateFromError are not available in functional components.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // State to manage whether an error has occurred
  state: ErrorBoundaryState = { hasError: false, error: null, errorInfo: null };

  /**
   * getDerivedStateFromError is a static method that is called after an error has been
   * thrown by a descendant component. It receives the error that was thrown as an argument
   * and should return a value to update the state.
   *
   * @param {Error} error The error that was thrown.
   * @returns {{ hasError: boolean, error: Error }} An object to update the state with.
   */
  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  /**
   * componentDidCatch is a lifecycle method that is invoked after an error has been thrown
   * by a descendant component. It receives two arguments: the error and an object with a
   * componentStack key.
   *
   * @param {Error} error The error that was thrown.
   * @param {ErrorInfo} errorInfo An object containing the component stack trace.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[75vh] flex items-center justify-center p-4 bg-background rounded-lg">
          <Card className="w-full max-w-lg text-center">
            <CardHeader>
              <CardTitle className="flex justify-center items-center gap-2 text-4xl font-bold text-error">
                <AlertCircle className="h-10 w-10 text-error" /> Oops!
              </CardTitle>
              <CardDescription className="text-center text-lg">
                Something went wrong. An unexpected error occurred.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {this.state.error && (
                <details className="text-left text-sm bg-muted text-muted-foreground p-4 rounded-lg">
                  <summary className="cursor-pointer font-medium">Error Details</summary>
                  <pre className="whitespace-pre-wrap break-words mt-2">
                    {this.state.error.toString()}
                    {this.state.errorInfo && <br />}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              <Button onClick={() => window.location.reload()} className="mt-6">
                Reload Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    // If no error, render the children as normal.
    return this.props.children;
  }
}

export default ErrorBoundary;
