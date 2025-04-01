import { BaseError, DocumentError, MarkdownError, ReadabilityError, TurndownError } from './index';

/**
 * Format an error object into a human-readable string with detailed context
 * 
 * @param error - The error to format
 * @param includeStack - Whether to include the stack trace
 * @returns A formatted error string
 */
export function formatError(error: Error, includeStack = false): string {
  // For our custom error types, use the toString method
  if (error instanceof BaseError) {
    const result = error.toString();
    
    if (includeStack && error.stack) {
      return `${result}\n\nStack Trace:\n${error.stack}`;
    }
    
    return result;
  }
  
  // For standard errors
  let result = `${error.name}: ${error.message}`;
  
  if (includeStack && error.stack) {
    result += `\n\nStack Trace:\n${error.stack}`;
  }
  
  return result;
}

/**
 * Log an error to the console with detailed information
 * 
 * @param error - The error to log
 * @param prefix - An optional prefix to add to the log
 */
export function logError(error: Error, prefix = 'Error:'): void {
  console.error(`${prefix} ${formatError(error, true)}`);
}

/**
 * Create a custom error instance based on the error type and context
 * 
 * @param type - The type of error to create
 * @param message - The error message
 * @param context - Additional context for the error
 * @param cause - The original error that caused this one
 * @returns A custom error instance
 */
export function createError(
  type: 'document' | 'readability' | 'turndown' | 'markdown',
  message: string,
  context: Record<string, unknown> = {},
  cause?: Error
): BaseError {
  switch (type) {
    case 'document':
      return new DocumentError(
        message,
        { url: context.url as string || 'unknown', ...context },
        cause
      );
      
    case 'readability':
      return new ReadabilityError(
        message,
        { url: context.url as string || 'unknown', ...context },
        cause
      );
      
    case 'turndown':
      return new TurndownError(
        message,
        context,
        cause
      );
      
    case 'markdown':
      return new MarkdownError(
        message,
        { url: context.url as string || 'unknown', ...context },
        cause
      );
      
    default:
      return new BaseError(message, context, cause);
  }
}

/**
 * Assert that a condition is true, or throw an error
 * 
 * @param condition - The condition to check
 * @param errorType - The type of error to throw
 * @param message - The error message
 * @param context - Additional context for the error
 */
export function assert(
  condition: boolean,
  errorType: 'document' | 'readability' | 'turndown' | 'markdown',
  message: string,
  context: Record<string, unknown> = {}
): void {
  if (!condition) {
    throw createError(errorType, message, context);
  }
} 