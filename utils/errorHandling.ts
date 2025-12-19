/**
 * Error handling utilities and custom error classes
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' | 'critical'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Handles FileReader errors
 */
export const handleFileReaderError = (error: ProgressEvent<FileReader> | null): AppError => {
  return new AppError(
    'Failed to read file. Please ensure the file is not corrupted and try again.',
    'FILE_READ_ERROR',
    'high'
  );
};

/**
 * Handles Image loading errors
 */
export const handleImageLoadError = (): AppError => {
  return new AppError(
    'Failed to load image. Please ensure the file is a valid image format (PNG, JPG, SVG).',
    'IMAGE_LOAD_ERROR',
    'high'
  );
};

/**
 * Handles AI/API errors
 */
export const handleAIError = (error: unknown): AppError => {
  if (error instanceof Error) {
    if (error.message.includes('API key') || error.message.includes('apiKey')) {
      return new AppError(
        'AI service configuration error. Please check your API key and try again.',
        'AI_CONFIG_ERROR',
        'critical'
      );
    }
    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return new AppError(
        'API rate limit reached. Please wait a moment and try again.',
        'AI_RATE_LIMIT_ERROR',
        'medium'
      );
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return new AppError(
        'Network error. Please check your connection and try again.',
        'NETWORK_ERROR',
        'medium'
      );
    }
  }

  return new AppError(
    'AI analysis unavailable. Using smart defaults. Your icons are still being generated!',
    'AI_SERVICE_ERROR',
    'medium'
  );
};

/**
 * Handles localStorage errors
 */
export const handleStorageError = (): AppError => {
  return new AppError(
    'Storage is full or unavailable. Some features may not work properly.',
    'STORAGE_ERROR',
    'low'
  );
};

/**
 * Handles file validation errors
 */
export const handleFileValidationError = (reason: string): AppError => {
  return new AppError(
    `Invalid file: ${reason}. Please upload a valid image file (PNG, JPG, or SVG) under 10MB.`,
    'FILE_VALIDATION_ERROR',
    'medium'
  );
};

/**
 * Converts any error to a user-friendly message
 */
export const getUserFriendlyMessage = (error: unknown): string => {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    // Check for common error patterns
    if (error.message.includes('Failed to fetch')) {
      return 'Connection error. Please check your internet connection and try again.';
    }
    if (error.message.includes('NetworkError')) {
      return 'Network error occurred. Please try again.';
    }
    if (error.message.includes('timeout')) {
      return 'Request timed out. Please try again.';
    }

    // Return the error message if it's user-friendly enough
    if (error.message.length < 100 && !error.message.includes('undefined')) {
      return error.message;
    }
  }

  return 'An unexpected error occurred. Please try again.';
};

/**
 * Logs error for debugging while returning user-friendly message
 */
export const logAndFormat = (error: unknown, context?: string): string => {
  if (context) {
    console.error(`Error in ${context}:`, error);
  } else {
    console.error('Error:', error);
  }

  return getUserFriendlyMessage(error);
};

/**
 * Retry logic with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};
