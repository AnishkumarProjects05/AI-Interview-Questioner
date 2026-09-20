/**
 * Escapes characters that have special meaning in HTML to prevent HTML injection and XSS.
 * 
 * @param {string} str - The input string to sanitize.
 * @returns {string} The escaped string.
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes and trims user input for LLM prompts to prevent prompt injection and token overflow.
 * Removes control characters and null bytes, and caps length.
 * 
 * @param {string} input - User-supplied string.
 * @param {number} maxLen - Maximum allowed character length (default: 5000).
 * @returns {string} Sanitized string.
 */
export function sanitizePromptInput(input, maxLen = 5000) {
  if (!input || typeof input !== 'string') return '';
  
  // Strip null bytes and non-printable control characters (keep standard newlines and tabs)
  let cleaned = input.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  cleaned = cleaned.trim();
  if (cleaned.length > maxLen) {
    cleaned = cleaned.slice(0, maxLen);
  }
  return cleaned;
}

/**
 * Validates an uploaded PDF buffer against size limits and authentic PDF header magic bytes.
 * PDF files must begin with '%PDF-' (0x25, 0x50, 0x44, 0x46, 0x2D).
 * 
 * @param {Buffer | Uint8Array} buffer - File buffer.
 * @param {number} maxSizeBytes - Maximum size in bytes (default: 5MB = 5 * 1024 * 1024).
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePdfBuffer(buffer, maxSizeBytes = 5 * 1024 * 1024) {
  if (!buffer || buffer.length === 0) {
    return { valid: false, error: 'File is empty.' };
  }

  if (buffer.length > maxSizeBytes) {
    const mbLimit = Math.round(maxSizeBytes / (1024 * 1024));
    return { valid: false, error: `File size exceeds the maximum limit of ${mbLimit}MB.` };
  }

  // Check magic bytes: %PDF- (hex: 25 50 44 46 2d)
  if (buffer.length < 5) {
    return { valid: false, error: 'File is corrupted or too small to be a valid PDF.' };
  }

  const header = buffer.slice(0, 5).toString('ascii');
  if (!header.startsWith('%PDF-')) {
    return { valid: false, error: 'Invalid file format. File must be an authentic PDF document.' };
  }

  return { valid: true };
}
