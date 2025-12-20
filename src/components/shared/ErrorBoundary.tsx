import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-violet-50 via-pink-50 to-blue-50">
          <div className="glass-card backdrop-blur-xl bg-white/60 p-12 sm:p-16 rounded-[40px] sm:rounded-[60px] max-w-2xl text-center space-y-8 shadow-2xl border border-white/80">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto bg-rose-100 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight uppercase">
                Something Went Wrong
              </h2>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed px-4">
                We encountered an unexpected error. This has been logged and we'll look into it.
                Please try refreshing the page or returning to the home screen.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-rose-50 p-6 rounded-2xl border border-rose-200">
                <summary className="text-sm font-bold text-rose-800 cursor-pointer mb-3">
                  Error Details (Development Mode)
                </summary>
                <div className="space-y-2 text-xs font-mono text-rose-700">
                  <p className="font-bold">{this.state.error.toString()}</p>
                  {this.state.errorInfo && (
                    <pre className="overflow-x-auto whitespace-pre-wrap break-words">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={this.handleReload}
                className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl"
                aria-label="Reload page"
              >
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-xl border-2 border-slate-200"
                aria-label="Try again"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
