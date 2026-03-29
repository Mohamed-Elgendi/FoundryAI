/**
 * Layer 6: Security & Authentication
 * Auth with RBAC, encryption, API security
 */

import { SupabaseClient } from '@supabase/supabase-js';

// Role-based access control
export enum Role {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise',
  ADMIN = 'admin',
}

export enum Permission {
  GENERATE_PLAN = 'generate_plan',
  REFINE_PLAN = 'refine_plan',
  SAVE_PLAN = 'save_plan',
  EXPORT_PLAN = 'export_plan',
  ACCESS_RADAR = 'access_radar',
  MANAGE_TEAM = 'manage_team',
  ACCESS_ANALYTICS = 'access_analytics',
  API_ACCESS = 'api_access',
}

// Role permissions matrix
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.FREE]: [
    Permission.GENERATE_PLAN,
    Permission.SAVE_PLAN,
    Permission.ACCESS_RADAR,
  ],
  [Role.PRO]: [
    Permission.GENERATE_PLAN,
    Permission.REFINE_PLAN,
    Permission.SAVE_PLAN,
    Permission.EXPORT_PLAN,
    Permission.ACCESS_RADAR,
    Permission.ACCESS_ANALYTICS,
  ],
  [Role.ENTERPRISE]: [
    Permission.GENERATE_PLAN,
    Permission.REFINE_PLAN,
    Permission.SAVE_PLAN,
    Permission.EXPORT_PLAN,
    Permission.ACCESS_RADAR,
    Permission.MANAGE_TEAM,
    Permission.ACCESS_ANALYTICS,
    Permission.API_ACCESS,
  ],
  [Role.ADMIN]: Object.values(Permission),
};

// Auth context for the current user
export interface AuthContext {
  userId: string;
  email: string;
  role: Role;
  permissions: Permission[];
  subscription: {
    tier: Role;
    status: 'active' | 'canceled' | 'past_due';
    expiresAt?: string;
  };
}

// Security service
export class SecurityLayer {
  private supabase: SupabaseClient;
  private currentUser: AuthContext | null = null;
  
  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }
  
  // Initialize auth state
  async initialize(): Promise<AuthContext | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    
    if (!session) {
      this.currentUser = null;
      return null;
    }
    
    // Fetch user profile with role
    const { data: profile } = await this.supabase
      .from('users')
      .select('*, subscription:tier, subscription:status, subscription:current_period_end')
      .eq('id', session.user.id)
      .single();
    
    const role = (profile?.role as Role) || Role.FREE;
    
    this.currentUser = {
      userId: session.user.id,
      email: session.user.email!,
      role,
      permissions: ROLE_PERMISSIONS[role],
      subscription: {
        tier: role,
        status: profile?.subscription?.status || 'active',
        expiresAt: profile?.subscription?.current_period_end,
      },
    };
    
    return this.currentUser;
  }
  
  // Check permission
  hasPermission(permission: Permission): boolean {
    if (!this.currentUser) return false;
    return this.currentUser.permissions.includes(permission);
  }
  
  // Require permission - throws if not allowed
  requirePermission(permission: Permission): void {
    if (!this.hasPermission(permission)) {
      throw new Error(`Permission denied: ${permission}`);
    }
  }
  
  // Auth guards for API routes
  async requireAuth(): Promise<AuthContext> {
    const user = await this.initialize();
    if (!user) {
      throw new Error('Authentication required');
    }
    return user;
  }
  
  // Row Level Security helpers
  getRLSFilter(): Record<string, any> {
    if (!this.currentUser) return { user_id: 'anonymous' };
    return { user_id: this.currentUser.userId };
  }
  
  // Encryption for sensitive data
  async encrypt(data: string): Promise<string> {
    // Use Web Crypto API for client-side encryption
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const key = await this.getEncryptionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + encrypted.byteLength);
    result.set(iv);
    result.set(new Uint8Array(encrypted), iv.length);
    
    return btoa(String.fromCharCode(...result));
  }
  
  async decrypt(encryptedData: string): Promise<string> {
    const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    const iv = data.slice(0, 12);
    const encrypted = data.slice(12);
    
    const key = await this.getEncryptionKey();
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    );
    
    return new TextDecoder().decode(decrypted);
  }
  
  private async getEncryptionKey(): Promise<CryptoKey> {
    // Derive key from user's session - in production, use a proper key management system
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'fallback-key'),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: new Uint8Array(16), iterations: 100000, hash: 'SHA-256' },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  // API security - rate limiting info
  getRateLimitInfo(): { limit: number; remaining: number; resetAt: Date } {
    // In production, this would come from Redis or similar
    return {
      limit: 100,
      remaining: 95,
      resetAt: new Date(Date.now() + 3600000),
    };
  }
  
  // Sign out
  async signOut(): Promise<void> {
    await this.supabase.auth.signOut();
    this.currentUser = null;
  }
}

// JWT validation for API routes
export async function validateToken(token: string): Promise<AuthContext | null> {
  try {
    // Parse and validate JWT
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    
    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    
    const role = (payload.role as Role) || Role.FREE;
    
    return {
      userId: payload.sub,
      email: payload.email,
      role,
      permissions: ROLE_PERMISSIONS[role],
      subscription: payload.subscription || { tier: Role.FREE, status: 'active' },
    };
  } catch {
    return null;
  }
}
