/**
 * Security Audit Module
 * Activity logging and audit trail
 */

export interface AuditEvent {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  details?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  timestamp: string;
}

export function logAudit(event: Omit<AuditEvent, 'id' | 'timestamp'>): void {
  const auditEvent: AuditEvent = {
    ...event,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString()
  };
  
  // In production, send to logging service
  console.log('[AUDIT]', auditEvent);
}

export function logSecurityEvent(
  action: string,
  details?: Record<string, unknown>
): void {
  logAudit({
    action,
    resource: 'security',
    details
  });
}
