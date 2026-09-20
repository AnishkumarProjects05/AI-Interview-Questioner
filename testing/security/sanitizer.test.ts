/**
 * @jest-environment node
 */
import { escapeHtml, sanitizePromptInput, validatePdfBuffer } from '@/lib/sanitizer';

describe('Sanitizer and Security Utilities', () => {
  describe('escapeHtml', () => {
    it('escapes characters with special HTML meaning', () => {
      const input = '<script>alert("XSS & injection")</script>';
      const escaped = escapeHtml(input);

      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
      expect(escaped).toContain('&amp;');
      expect(escaped).toContain('&quot;');
      expect(escaped).toContain('&#x2F;');
    });

    it('handles null, undefined, and non-string values gracefully', () => {
      expect(escapeHtml(null as any)).toBe('');
      expect(escapeHtml(undefined as any)).toBe('');
      expect(escapeHtml(12345 as any)).toBe('');
    });

    it('leaves safe strings unmodified', () => {
      const safe = 'John Doe, Software Engineer';
      expect(escapeHtml(safe)).toBe(safe);
    });
  });

  describe('sanitizePromptInput', () => {
    it('strips null bytes and non-printable control characters', () => {
      const maliciousInput = 'Hello\x00World\x08Test\x1FKeep\nNewlines\tTabs';
      const sanitized = sanitizePromptInput(maliciousInput);

      expect(sanitized).not.toContain('\x00');
      expect(sanitized).not.toContain('\x08');
      expect(sanitized).not.toContain('\x1F');
      expect(sanitized).toContain('HelloWorldTestKeep\nNewlines\tTabs');
    });

    it('enforces maximum character length', () => {
      const longString = 'A'.repeat(500);
      const sanitized = sanitizePromptInput(longString, 100);

      expect(sanitized.length).toBe(100);
    });

    it('returns empty string for empty or non-string inputs', () => {
      expect(sanitizePromptInput('')).toBe('');
      expect(sanitizePromptInput(null as any)).toBe('');
      expect(sanitizePromptInput(undefined as any)).toBe('');
    });
  });

  describe('validatePdfBuffer', () => {
    it('accepts a valid PDF buffer starting with %PDF-', () => {
      const validPdfBuffer = Buffer.from('%PDF-1.4 sample pdf content here');
      const result = validatePdfBuffer(validPdfBuffer);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('rejects an empty buffer', () => {
      const emptyBuffer = Buffer.alloc(0);
      const result = validatePdfBuffer(emptyBuffer);

      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/empty/i);
    });

    it('rejects a buffer exceeding maximum allowed size', () => {
      const largeBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
      largeBuffer.write('%PDF-');
      const result = validatePdfBuffer(largeBuffer, 5 * 1024 * 1024);

      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/exceeds the maximum limit/i);
    });

    it('rejects a non-PDF file or disguised executable', () => {
      const fakePdfBuffer = Buffer.from('MZ\x90\x00\x03\x00\x00\x00 disguised exe content');
      const result = validatePdfBuffer(fakePdfBuffer);

      expect(result.valid).toBe(false);
      expect(result.error).toMatch(/must be an authentic PDF document/i);
    });
  });
});
