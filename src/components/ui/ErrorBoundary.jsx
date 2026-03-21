import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-lg w-full p-8 text-center border border-slate-200 dark:border-slate-700">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-2xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
              Oops! Something went wrong.
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-8">
              We're sorry, but an unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors focus:ring-4 focus:ring-purple-500/50"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <i className="fas fa-home mr-2"></i>
                Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 text-left bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto">
                <p className="text-red-500 font-mono text-sm mb-2 font-bold">Error Details:</p>
                <pre className="text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {this.state.error && this.state.error.toString()}
                </pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
