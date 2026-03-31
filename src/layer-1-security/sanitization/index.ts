/**
 * Security Sanitization Module
 * Input/output sanitization utilities
 */

export function sanitizeInput(input: string): string {
  // Basic XSS prevention
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function sanitizeHtml(html: string): string {
  // Allow only safe HTML tags
  const allowedTags = ['b', 'i', 'em', 'strong', 'p', 'br'];
  // Strip all other tags
  return html.replace(/<[^>]*>/g, (tag) => {
    const tagName = tag.replace(/[<>\/]/g, '').split(' ')[0];
    return allowedTags.includes(tagName) ? tag : '';
  });
}
