'use client'

import { useEffect, useRef, useState } from 'react'
import { Application } from '@splinetool/runtime'
import { motion } from 'motion/react'

interface SplineSceneProps {
  scene: string
  className?: string
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch (e) {
    return false
  }
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [useFallback, setUseFallback] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [clickReaction, setClickReaction] = useState(false)

  useEffect(() => {
    // 1. Force attempt to load the 3D scene (bypassing manual WebGL check)
    // We let the try/catch block handle any actual WebGL initialization failures.

    let splineApp: Application | null = null
    let isMounted = true
    const canvas = canvasRef.current

    // Handle WebGL context loss/restore to prevent console errors
    // when the browser reclaims GPU resources
    const handleContextLost = (e: Event) => {
      e.preventDefault() // Allows context to be restored
      console.warn('WebGL context lost — waiting for restore...')
    }

    const handleContextRestored = () => {
      console.info('WebGL context restored — reinitializing scene.')
      if (isMounted) {
        initSpline()
      }
    }

    if (canvas) {
      canvas.addEventListener('webglcontextlost', handleContextLost)
      canvas.addEventListener('webglcontextrestored', handleContextRestored)
    }

    async function initSpline() {
      if (!canvas) return

      try {
        // Dispose previous instance before reinitializing (e.g., after context restore)
        if (splineApp) {
          try { splineApp.dispose() } catch (_) { /* ignore */ }
          splineApp = null
        }

        splineApp = new Application(canvas)
        await splineApp.load(scene)
        
        if (isMounted) {
          setIsLoading(false)
        }
      } catch (err) {
        console.error('Error loading Spline scene:', err)
        if (isMounted) {
          // If loading or context creation fails, fall back gracefully
          setUseFallback(true)
          setIsLoading(false)
        }
      }
    }

    initSpline()

    return () => {
      isMounted = false
      if (canvas) {
        canvas.removeEventListener('webglcontextlost', handleContextLost)
        canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      }
      if (splineApp) {
        try {
          splineApp.dispose()
        } catch (e) {
          // Ignore dispose error
        }
      }
    }
  }, [scene])

  // Mouse move handler for the interactive 2D fallback tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    // Map mouse coordinate to range [-0.5, 0.5] relative to center
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePos({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const triggerClickReaction = () => {
    setClickReaction(true)
    setTimeout(() => setClickReaction(false), 1200)
  }

  // Eye and face movement parallax offsets for 2D mode
  const headX = mousePos.x * 20
  const headY = mousePos.y * 15
  const visorX = mousePos.x * 28
  const visorY = mousePos.y * 22
  const eyeX = mousePos.x * 35
  const eyeY = mousePos.y * 26

  return (
    <div 
      ref={containerRef}
      onMouseMove={useFallback ? handleMouseMove : undefined}
      onMouseEnter={useFallback ? () => setIsHovered(true) : undefined}
      onMouseLeave={useFallback ? handleMouseLeave : undefined}
      onClick={useFallback ? triggerClickReaction : undefined}
      className={`overflow-hidden select-none ${useFallback ? 'cursor-pointer' : ''} ${className || 'relative w-full h-full'}`}
    >
      {!useFallback ? (
        <>
          <canvas 
            ref={canvasRef} 
            className={`w-full h-full block transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`} 
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/50 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-orange animate-pulse">Initializing 3D Character...</p>
              </div>
            </div>
          )}
        </>
      ) : (
        /* PREMIUM HIGH-FIDELITY INTERACTIVE 2D VECTOR ROBOT FALLBACK */
        <div className="absolute inset-0 bg-brand-black flex flex-col items-center justify-center p-6 select-none overflow-hidden">
          {/* Cybernetic ambient backdrop lights */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-orange/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Subtle rotating background interface ring */}
          <svg className="absolute w-[380px] h-[380px] text-brand-orange/10 animate-[spin_60s_linear_infinite] pointer-events-none" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="85" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 5" />
            <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="40 10 5 10" />
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1 10" />
          </svg>

          {/* Futuristic corner UI brackets */}
          <div className="absolute top-8 left-8 text-brand-white/10 font-mono text-xs pointer-events-none">┌ ID: BOT_RECONSTRUCT</div>
          <div className="absolute top-8 right-8 text-brand-white/10 font-mono text-xs pointer-events-none">SYSTEM_OK ┐</div>
          <div className="absolute bottom-8 left-8 text-brand-white/10 font-mono text-xs pointer-events-none">└ SENSORS: ACTIVED</div>
          <div className="absolute bottom-8 right-8 text-brand-white/10 font-mono text-xs pointer-events-none">GL_BYPASS: 2D_SPRING ┘</div>

          {/* Interactive Floating Sci-Fi Annotations */}
          <div className="absolute left-6 top-1/3 hidden xl:flex flex-col gap-3 font-mono text-[9px] text-brand-gray/40 pointer-events-none">
            <div className="flex items-center gap-1.5 border border-brand-white/5 bg-brand-dark/40 px-2 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping"></span>
              <span>CORE STAT: OPERATIONAL</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-2 border-l border-brand-orange/20">
              <div>SENSITIVITY: 24.1 Hz</div>
              <div>COGNITIVE LINK: SYNCHRONIZED</div>
              <div>REACTIVE DEPTH: TRUE</div>
            </div>
          </div>

          <div className="absolute right-6 top-1/3 hidden xl:flex flex-col gap-3 font-mono text-[9px] text-brand-gray/40 pointer-events-none items-end">
            <div className="flex items-center gap-1.5 border border-brand-white/5 bg-brand-dark/40 px-2 py-1 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></span>
              <span>MODE: INTELLIGENT FALLBACK</span>
            </div>
            <div className="flex flex-col gap-0.5 pr-2 border-r border-brand-orange/20 text-right">
              <div>VECTOR PARALLAX: ACTIVE</div>
              <div>MOUSE INTERCEPT: ENABLED</div>
              <div>GL_RENDER: BLOCKED_BY_BROWSER</div>
            </div>
          </div>

          {/* Main interactive pseudo-3D Robot Head container */}
          <div className="relative w-72 h-72 flex items-center justify-center group">
            
            {/* Robot Base / Neck Connector */}
            <div 
              style={{ 
                transform: `translateX(${headX * 0.4}px) translateY(${headY * 0.4}px)`,
                transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
              className="absolute bottom-12 w-20 h-16 bg-gradient-to-t from-brand-black via-brand-dark to-brand-gray/40 border border-brand-white/10 rounded-xl flex items-center justify-center shadow-inner"
            >
              <div className="w-12 h-1 bg-brand-orange/40 rounded animate-pulse" />
            </div>

            {/* Main Head Unit */}
            <div
              style={{
                transform: `translateX(${headX}px) translateY(${headY}px) rotateX(${-mousePos.y * 15}deg) rotateY(${mousePos.x * 20}deg)`,
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
              className="relative w-56 h-56 flex items-center justify-center"
            >
              
              {/* Outer Left Ear Antenna */}
              <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-12 bg-gradient-to-r from-brand-orange to-brand-dark rounded-l-lg border-l border-brand-orange/40 flex items-center justify-start pl-1">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
              </div>

              {/* Outer Right Ear Antenna */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-8 h-12 bg-gradient-to-l from-brand-orange to-brand-dark rounded-r-lg border-r border-brand-orange/40 flex items-center justify-end pr-1">
                <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
              </div>

              {/* High-tech main metallic helmet plating */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand-gray/30 via-brand-dark/95 to-brand-black rounded-[50px] border-2 border-brand-white/10 shadow-2xl overflow-hidden flex items-center justify-center">
                
                {/* Internal HUD / Scanning Line overlay */}
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-orange/30 animate-[scan_3s_linear_infinite]" />

                {/* Cybernetic inner dark reflective visor shield */}
                <div 
                  style={{
                    transform: `translateX(${visorX}px) translateY(${visorY}px)`,
                    transition: 'transform 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                  className="w-[84%] h-[68%] rounded-[36px] bg-gradient-to-br from-[#12121e] via-brand-black to-[#08080f] border border-brand-white/20 shadow-inner relative flex items-center justify-center overflow-hidden"
                >
                  {/* Visor shine highlights */}
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent skew-y-6 transform origin-top-left pointer-events-none" />
                  
                  {/* Glowing holographic radar concentric grid in visor */}
                  <div className="absolute inset-4 rounded-full border border-brand-orange/5 flex items-center justify-center animate-[pulse_4s_infinite]">
                    <div className="w-16 h-16 rounded-full border border-brand-orange/10 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border border-brand-orange/25" />
                    </div>
                  </div>

                  {/* DIGITAL LED MATRIX ROBOTIC EYES (With Parallax tracking) */}
                  <div 
                    style={{
                      transform: `translateX(${eyeX}px) translateY(${eyeY}px)`,
                      transition: 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                    className="flex justify-between items-center w-32 px-4 z-10"
                  >
                    {!clickReaction ? (
                      <>
                        {/* Left Eye */}
                        <div className="flex flex-col items-center gap-1.5 relative group">
                          {/* Eye glowing pulse outer border */}
                          <div className={`absolute -inset-2.5 rounded-full bg-brand-orange/30 blur-md transition-all duration-300 ${isHovered ? 'scale-125 bg-cyan-500/30' : ''}`} />
                          <div className={`w-8 h-8 rounded-full bg-brand-orange border-2 border-brand-white/80 flex items-center justify-center shadow-[0_0_15px_#FF6B00] relative overflow-hidden transition-all duration-300 ${isHovered ? 'bg-cyan-400 shadow-[0_0_15px_#00F0FF] scale-110' : ''}`}>
                            {/* Inner pupil reflection */}
                            <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-white opacity-80" />
                          </div>
                        </div>

                        {/* Right Eye */}
                        <div className="flex flex-col items-center gap-1.5 relative group">
                          {/* Eye glowing pulse outer border */}
                          <div className={`absolute -inset-2.5 rounded-full bg-brand-orange/30 blur-md transition-all duration-300 ${isHovered ? 'scale-125 bg-cyan-500/30' : ''}`} />
                          <div className={`w-8 h-8 rounded-full bg-brand-orange border-2 border-brand-white/80 flex items-center justify-center shadow-[0_0_15px_#FF6B00] relative overflow-hidden transition-all duration-300 ${isHovered ? 'bg-cyan-400 shadow-[0_0_15px_#00F0FF] scale-110' : ''}`}>
                            {/* Inner pupil reflection */}
                            <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-white opacity-80" />
                          </div>
                        </div>
                      </>
                    ) : (
                      /* CUTE CURVED HAPPY EYES ON CLICK */
                      <div className="flex justify-between items-center w-full px-2">
                        <svg className="w-10 h-6 text-brand-orange animate-[pulse_0.2s_infinite]" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                          <path d="M2 10C4 4 10 4 12 10" />
                        </svg>
                        <svg className="w-10 h-6 text-brand-orange animate-[pulse_0.2s_infinite]" viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                          <path d="M2 10C4 4 10 4 12 10" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Animated mouth line that acts like a speaker wave */}
                  <div className="absolute bottom-6 flex gap-0.5 justify-center items-center h-2">
                    <span className={`w-1 bg-brand-orange/80 rounded-full transition-all duration-300 ${clickReaction ? 'h-6 bg-brand-orange animate-[pulse_0.15s_infinite]' : 'h-1 animate-[pulse_2s_infinite]'}`} />
                    <span className={`w-1 bg-brand-orange/80 rounded-full transition-all duration-300 ${clickReaction ? 'h-4 bg-brand-orange' : 'h-2 animate-[pulse_1.5s_infinite_0.2s]'}`} />
                    <span className={`w-1 bg-brand-orange/80 rounded-full transition-all duration-300 ${clickReaction ? 'h-5 bg-brand-orange animate-[pulse_0.1s_infinite]' : 'h-1 animate-[pulse_2.5s_infinite_0.4s]'}`} />
                    <span className={`w-1 bg-brand-orange/80 rounded-full transition-all duration-300 ${clickReaction ? 'h-4 bg-brand-orange' : 'h-2 animate-[pulse_1.5s_infinite_0.2s]'}`} />
                    <span className={`w-1 bg-brand-orange/80 rounded-full transition-all duration-300 ${clickReaction ? 'h-6 bg-brand-orange animate-[pulse_0.15s_infinite]' : 'h-1 animate-[pulse_2s_infinite]'}`} />
                  </div>

                </div>
              </div>

              {/* Glowing top signal orb */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-brand-orange border border-brand-white shadow-[0_0_15px_#FF6B00] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-white animate-ping" />
              </div>
            </div>

          </div>

          {/* Interactive footer micro-instruction */}
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-brand-orange/70 mt-4 animate-pulse">
            {clickReaction ? "★ INITIALIZING SYSTEM GREETING ★" : "✦ HOVER TO TRACK • CLICK TO COMMUNICATE ✦"}
          </p>
        </div>
      )}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(10,10,10,0.8)]"></div>
    </div>
  )
}
