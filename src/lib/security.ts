import { Request, Response, NextFunction } from "express";

// 1. INPUT SANITIZATION AND VALIDATION UTILITIES

/**
 * Standard RFC 5322 compliant email validator.
 * Prevents header injection or malformed inputs.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 255) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

/**
 * Strips HTML tags and encodes dangerous characters to prevent persistent XSS.
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  
  // Strip common HTML tags first
  let cleaned = input.replace(/<[^>]*>/g, "");
  
  // Encode essential characters to prevent scripts execution
  return cleaned
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}


// 2. RATE LIMITER HAS BEEN MOVED TO rate-limit.ts

// 3. SECURITY HEADERS MIDDLEWARE

export function applySecurityHeaders(req: Request, res: Response, next: NextFunction): void {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking by restricting frame embedding
  // We allow rendering in Google Run apps, AI Studio preview, and local contexts
  const frameAncestors = "frame-ancestors 'self' https://*.run.app https://ai.studio https://*.google.com https://*.googleusercontent.com";
  
  // Custom secure Content-Security-Policy that permits Spline 3D rendering
  const cspDirectives = [
    "default-src 'self'",
    // Vite uses dev-mode eval, and Spline depends on JS runtimes
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://prod.spline.design https://*.spline.design",
    // Vite relies on wss: connections for fast hot replacement, Spline connects to assets
    "connect-src 'self' https://prod.spline.design https://*.spline.design ws: wss: http: https: blob:",
    // Allow images and assets from self, data/blob URLs, and any HTTPS domain (for portfolio screenshots)
    "img-src 'self' data: blob: https:",
    // Allow CSS files and inline styles for Tailwind
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Google fonts
    "font-src 'self' data: https://fonts.gstatic.com",
    // Spline uses Web Workers and Canvas blobs
    "worker-src 'self' blob:",
    "child-src 'self' blob: https:",
    // Embed code spline scenes
    "frame-src 'self' https://prod.spline.design https://*.spline.design",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    frameAncestors
  ].join("; ");

  res.setHeader("Content-Security-Policy", cspDirectives);

  // Older browser XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Prevent referrer leaks across origins
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // HTTP Strict Transport Security (HSTS)
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

  next();
}


// 4. GLOBAL SECURE ERROR HANDLER

export function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error("Unhandle server exception:", err);

  // Return a generic secure message to prevent leaking framework traces or paths
  res.status(500).json({
    error: "An unexpected error occurred. Please try again later.",
    success: false
  });
}
