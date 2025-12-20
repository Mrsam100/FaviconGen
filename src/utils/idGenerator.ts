/**
 * Secure ID generation utilities using Web Crypto API
 */

/**
 * Generates a cryptographically secure UUID
 */
export const generateSecureId = (): string => {
  // Use native crypto.randomUUID if available (modern browsers)
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return `${Date.now()}-${getRandomHex(8)}-${getRandomHex(4)}-${getRandomHex(4)}-${getRandomHex(12)}`;
};

/**
 * Generates a short cryptographically secure ID
 */
export const generateShortId = (length: number = 9): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, byte => byte.toString(36))
    .join('')
    .slice(0, length);
};

/**
 * Helper function to generate random hex string
 */
function getRandomHex(length: number): string {
  const array = new Uint8Array(Math.ceil(length / 2));
  crypto.getRandomValues(array);

  return Array.from(array, byte => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, length);
}
