/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitizes general text input by removing dangerous characters
 */
export const sanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') return '';

  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove angle brackets to prevent XSS
    .trim();
};

/**
 * Sanitizes filenames to prevent path traversal and injection attacks
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName || typeof fileName !== 'string') return 'unnamed';

  return fileName
    .replace(/[^a-zA-Z0-9._-]/g, '_') // Only allow alphanumeric, dots, dashes, underscores
    .replace(/\.+/g, '.') // Prevent multiple consecutive dots
    .replace(/^\.+/, '') // Remove leading dots
    .slice(0, 255); // Limit length
};

/**
 * Validates if a file is a valid image file
 */
export const isValidImageFile = (file: File): boolean => {
  const validTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/webp',
    'image/svg+xml'
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB

  return validTypes.includes(file.type) && file.size <= maxSize && file.size > 0;
};

/**
 * Validates image dimensions
 */
export const isValidImageDimensions = (width: number, height: number): boolean => {
  const minDimension = 32;
  const maxDimension = 8192;

  return width >= minDimension &&
         height >= minDimension &&
         width <= maxDimension &&
         height <= maxDimension;
};

/**
 * Gets the actual MIME type from file extension as fallback
 */
export const getMimeTypeFromExtension = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'svg': 'image/svg+xml'
  };

  return mimeTypes[extension || ''] || 'image/jpeg';
};
