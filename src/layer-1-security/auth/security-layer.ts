/**
 * LAYER 5: SECURITY LAYER
 * =======================
 * Comprehensive security implementation
 * XSS prevention, CSRF protection, input sanitization, rate limiting
 */

// ==========================================
// XSS PREVENTION
// ==========================================

export class XSSProtection {
  private static readonly DANGEROUS_PATTERNS = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onerror, etc.
    /data:text\/html/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];

  /**
   * Sanitize HTML content
   */
  static sanitizeHtml(input: string): string {
    if (!input) return '';
    
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Check if input contains XSS patterns
   */
  static containsXSS(input: string): boolean {
    if (!input) return false;
    
    return this.DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
  }

  /**
   * Sanitize user input
   */
  static sanitizeInput(input: string): string {
    if (!input) return '';
    
    // Remove null bytes
    let sanitized = input.replace(/\x00/g, '');
    
    // Remove control characters except common whitespace
    sanitized = sanitized.replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Check for XSS patterns
    if (this.containsXSS(sanitized)) {
      // If XSS detected, escape everything
      return this.sanitizeHtml(sanitized);
    }
    
    return sanitized;
  }

  /**
   * Sanitize object recursively
   */
  static sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
    const sanitized: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = Array.isArray(value)
          ? value.map(v => typeof v === 'string' ? this.sanitizeInput(v) : v)
          : this.sanitizeObject(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized as T;
  }
}

// ==========================================
// CSRF PROTECTION
// ==========================================

export class CSRFProtection {
  private tokenKey = 'csrf-token';
  private token: string | null = null;

  /**
   * Generate CSRF token
   */
  generateToken(): string {
    const array = new Uint8Array(32);
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      // Fallback for older browsers
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Store in sessionStorage (not localStorage for security)
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.tokenKey, this.token);
    }
    
    return this.token;
  }

  /**
   * Get current token
   */
  getToken(): string | null {
    if (!this.token && typeof sessionStorage !== 'undefined') {
      this.token = sessionStorage.getItem(this.tokenKey);
    }
    return this.token;
  }

  /**
   * Validate token
   */
  validateToken(token: string): boolean {
    return token === this.getToken();
  }

  /**
   * Add token to headers
   */
  addToHeaders(headers: Record<string, string> = {}): Record<string, string> {
    const token = this.getToken() || this.generateToken();
    return {
      ...headers,
      'X-CSRF-Token': token,
    };
  }

  /**
   * Clear token
   */
  clearToken(): void {
    this.token = null;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.tokenKey);
    }
  }
}

// ==========================================
// RATE LIMITING
// ==========================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

export class RateLimiter {
  private limits = new Map<string, RateLimitEntry>();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request is allowed
   */
  isAllowed(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    let entry = this.limits.get(key);

    // Clean expired entry
    if (entry && now > entry.resetTime) {
      entry = undefined;
      this.limits.delete(key);
    }

    // Create new entry if needed
    if (!entry) {
      entry = {
        count: 0,
        resetTime: now + this.windowMs,
      };
      this.limits.set(key, entry);
    }

    const remaining = Math.max(0, this.maxRequests - entry.count);
    const allowed = entry.count < this.maxRequests;

    if (allowed) {
      entry.count++;
    }

    return {
      allowed,
      remaining,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Get time until reset
   */
  getTimeUntilReset(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;
    return Math.max(0, entry.resetTime - Date.now());
  }

  /**
   * Reset limit for key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clean all expired entries
   */
  clean(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  // API calls per user
  api: new RateLimiter(30, 60000), // 30 requests per minute
  
  // Idea generation
  generation: new RateLimiter(10, 60000), // 10 generations per minute
  
  // Feedback submission
  feedback: new RateLimiter(20, 60000), // 20 feedbacks per minute
  
  // Login attempts (if implemented)
  login: new RateLimiter(5, 300000), // 5 attempts per 5 minutes
};

// ==========================================
// CONTENT SECURITY POLICY
// ==========================================

export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Adjust for Next.js
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'connect-src': ["'self'", 'https://api.groq.com', 'https://openrouter.ai', 'https://*.supabase.co'],
  'frame-ancestors': ["'none'"],
  'form-action': ["'self'"],
  'base-uri': ["'self'"],
};

/**
 * Generate CSP header string
 */
export function generateCSPHeader(directives: typeof CSP_DIRECTIVES): string {
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

// ==========================================
// REQUEST VALIDATION
// ==========================================

export class RequestValidator {
  private maxBodySize: number;

  constructor(maxBodySize = 1024 * 1024) { // 1MB default
    this.maxBodySize = maxBodySize;
  }

  /**
   * Validate request size
   */
  validateSize(body: string): { valid: boolean; error?: string } {
    const size = new Blob([body]).size;
    
    if (size > this.maxBodySize) {
      return {
        valid: false,
        error: `Request body too large. Max size: ${this.maxBodySize} bytes`,
      };
    }
    
    return { valid: true };
  }

  /**
   * Validate content type
   */
  validateContentType(contentType: string, allowed: string[] = ['application/json']): boolean {
    return allowed.some(type => contentType.includes(type));
  }

  /**
   * Validate origin
   */
  validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
    if (!origin) return true; // Allow same-origin requests
    return allowedOrigins.includes(origin);
  }
}

// ==========================================
// SECURITY HEADERS
// ==========================================

export const SECURITY_HEADERS = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

// ==========================================
// PASSWORD/PIN UTILITIES (if needed)
// ==========================================

export class CryptoUtils {
  /**
   * Hash a string (simple hash for non-critical use)
   * For production, use bcrypt or argon2
   */
  static async hash(input: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback
    return btoa(input).split('').reverse().join('');
  }

  /**
   * Generate secure random ID
   */
  static generateId(length = 16): string {
    const array = new Uint8Array(length);
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Encrypt sensitive data (client-side encryption for storage)
   */
  static async encrypt(data: string, key: string): Promise<string> {
    // Simple XOR encryption (not for production, use proper encryption)
    const encoded = new TextEncoder().encode(data);
    const keyBytes = new TextEncoder().encode(key);
    const encrypted = encoded.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
    return btoa(String.fromCharCode(...encrypted));
  }

  /**
   * Decrypt data
   */
  static async decrypt(encrypted: string, key: string): Promise<string> {
    const decoded = atob(encrypted);
    const bytes = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      bytes[i] = decoded.charCodeAt(i);
    }
    
    const keyBytes = new TextEncoder().encode(key);
    const decrypted = bytes.map((byte, i) => byte ^ keyBytes[i % keyBytes.length]);
    return new TextDecoder().decode(decrypted);
  }
}

// ==========================================
// SECURITY LAYER FACADE
// ==========================================

export class SecurityLayer {
  public csrf: CSRFProtection;
  public requestValidator: RequestValidator;
  public rateLimiters: typeof rateLimiters;
  public cspDirectives: typeof CSP_DIRECTIVES;

  constructor() {
    this.csrf = new CSRFProtection();
    this.requestValidator = new RequestValidator();
    this.rateLimiters = rateLimiters;
    this.cspDirectives = CSP_DIRECTIVES;
  }

  /**
   * Initialize security layer
   */
  initialize(): void {
    // Generate CSRF token on init
    this.csrf.generateToken();
    
    // Start rate limiter cleanup
    setInterval(() => {
      Object.values(this.rateLimiters).forEach(limiter => limiter.clean());
    }, 60000);
    
    console.log('[SecurityLayer] Initialized');
  }

  /**
   * Sanitize all user inputs in an object
   */
  sanitize<T extends Record<string, unknown>>(data: T): T {
    return XSSProtection.sanitizeObject(data);
  }

  /**
   * Check if operation is rate limited
   */
  checkRateLimit(operation: keyof typeof rateLimiters, key: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    return this.rateLimiters[operation].isAllowed(key);
  }

  /**
   * Get all security headers
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      ...SECURITY_HEADERS,
      'Content-Security-Policy': generateCSPHeader(this.cspDirectives),
    };
  }

  /**
   * Validate request
   */
  validateRequest(req: {
    body: string;
    contentType: string;
    origin?: string;
    csrfToken?: string;
  }): { valid: boolean; error?: string } {
    // Check size
    const sizeCheck = this.requestValidator.validateSize(req.body);
    if (!sizeCheck.valid) {
      return sizeCheck;
    }

    // Check content type
    if (!this.requestValidator.validateContentType(req.contentType)) {
      return { valid: false, error: 'Invalid content type' };
    }

    // Validate CSRF token for state-changing operations
    if (req.csrfToken && !this.csrf.validateToken(req.csrfToken)) {
      return { valid: false, error: 'Invalid CSRF token' };
    }

    return { valid: true };
  }
}

// Singleton instance
export const securityLayer = new SecurityLayer();
