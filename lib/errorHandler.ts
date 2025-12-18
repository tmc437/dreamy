/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Convert various error types to a user-friendly message
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String(error.message);
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * Log errors (can be extended to send to a logging service)
 */
export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const errorMessage = getErrorMessage(error);
  
  console.error(`[${timestamp}]${context ? ` ${context}:` : ''} ${errorMessage}`);
  
  if (error instanceof Error && error.stack) {
    console.error('Stack trace:', error.stack);
  }

  // TODO: Send to error tracking service (e.g., Sentry) in production
}

/**
 * Handle authentication errors specifically
 */
export function handleAuthError(error: unknown): string {
  const message = getErrorMessage(error);
  
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  
  if (message.includes('Email not confirmed')) {
    return 'Please check your email and confirm your account.';
  }
  
  if (message.includes('Network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return 'Authentication failed. Please try again.';
}

/**
 * Handle database errors specifically
 */
export function handleDatabaseError(error: unknown): string {
  const message = getErrorMessage(error);
  
  if (message.includes('violates row-level security')) {
    return 'You do not have permission to perform this action.';
  }
  
  if (message.includes('duplicate key')) {
    return 'This entry already exists.';
  }
  
  if (message.includes('Network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return 'Database error. Please try again.';
}

/**
 * Handle AI/API errors specifically
 */
export function handleAIError(error: unknown): string {
  const message = getErrorMessage(error);
  
  if (message.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  if (message.includes('Unauthorized')) {
    return 'Session expired. Please log in again.';
  }
  
  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  if (message.includes('Network')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return 'AI analysis failed. Your dream was saved, but analysis could not be completed.';
}

