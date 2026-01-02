import { Component, type ErrorInfo, type ReactNode } from 'react';
import { toast } from 'sonner';
import { logError } from '@/lib/errorTracking';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, { componentStack: errorInfo.componentStack });
    toast.error('A critical error occurred. The team has been notified.');
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-destructive">Oops! Something went wrong.</h1>
            <p className="mt-4 text-muted-foreground">
              We've been notified of the issue. Please try refreshing the page or clicking the button below.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <pre className="mt-4 w-[600px] max-w-full overflow-auto whitespace-pre-wrap rounded-md bg-muted p-4 text-left text-sm">
                {this.state.error.stack || this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleRetry}
              className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
