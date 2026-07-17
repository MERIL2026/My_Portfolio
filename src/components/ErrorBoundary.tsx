import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (error.message && !error.message.includes("WebGL")) {
      console.error("Uncaught error:", error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="w-full h-full flex flex-col items-center justify-center bg-brand-dark/50 border border-brand-white/10 p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-brand-white/5 flex items-center justify-center border border-brand-white/10">
            <svg className="w-6 h-6 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
            </svg>
          </div>
          <div>
            <p className="text-brand-white font-medium mb-1">3D Scene Paused</p>
            <p className="text-brand-gray text-sm max-w-xs mx-auto">
              WebGL is not available in this preview environment. Please open the application in a new tab to view the interactive 3D scene.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
