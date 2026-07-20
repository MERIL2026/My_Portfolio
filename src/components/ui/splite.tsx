'use client'

import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

class ErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallback: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Spline WebGL Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <ErrorBoundary 
      fallback={
        <div className="w-full h-full flex flex-col items-center justify-center bg-brand-dark border border-brand-white/10 p-8 text-center">
          <div className="text-brand-orange mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
          </div>
          <p className="text-brand-white font-bold font-mono text-sm uppercase tracking-widest mb-2">3D Graphics Disabled</p>
          <p className="text-brand-white/50 text-xs max-w-xs">Please enable Hardware Acceleration in your browser settings to view the interactive 3D robot scene.</p>
        </div>
      }
    >
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <span className="loader">Loading 3D Scene...</span>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
