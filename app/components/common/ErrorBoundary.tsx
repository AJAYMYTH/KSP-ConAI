import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-critical/5 border border-critical/20 rounded-xxxl flex flex-col items-center justify-center text-center space-y-3 min-h-[160px] animate-in fade-in duration-200">
          <div className="w-10 h-10 rounded-full bg-critical-soft text-critical flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-ink-deep uppercase tracking-wider">
              {this.props.fallbackTitle || 'Component Render Error'}
            </h4>
            <p className="text-[11px] text-steel mt-1 max-w-xs leading-relaxed">
              Something went wrong while rendering this analytics block. Try reloading or resetting.
            </p>
          </div>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-canvas border border-hairline-soft hover:bg-surface-soft hover:border-hairline rounded-full text-[10px] font-bold text-ink transition cursor-pointer select-none"
          >
            <RotateCcw className="w-3 h-3" /> Retry View
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
