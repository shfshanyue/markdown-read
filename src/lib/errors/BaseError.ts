/**
 * Context information to be included with errors for better debugging
 */
export interface ErrorContext {
  /** The URL where the error occurred (if applicable) */
  url?: string;
  /** HTML content that was being processed (truncated for large content) */
  html?: string;
  /** Markdown content that was being generated (truncated for large content) */
  markdown?: string;
  /** Any additional helpful context information */
  [key: string]: unknown;
}

/**
 * Base error class for all markdown-read errors
 * Stores rich context information to aid in debugging
 */
export class BaseError extends Error {
  /**
   * Create a new BaseError with context information
   * 
   * @param message - Human-readable error message
   * @param context - Additional context information for debugging
   * @param cause - The original error that caused this error
   */
  constructor(
    message: string, 
    public readonly context: ErrorContext = {}, 
    public readonly cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    
    // Maintain proper stack trace in Node.js
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    
    // Process context to avoid excessive data in errors
    this.truncateContextValues();
  }

  /**
   * Get a string representation of the error with context
   */
  toString(): string {
    let result = `${this.name}: ${this.message}`;
    
    if (Object.keys(this.context).length > 0) {
      result += `\nContext: ${JSON.stringify(this.context, null, 2)}`;
    }
    
    if (this.cause) {
      result += `\nCaused by: ${this.cause.toString()}`;
    }
    
    return result;
  }

  /**
   * Truncates large context values to prevent memory issues
   * and ensure errors are readable
   */
  private truncateContextValues(): void {
    for (const [key, value] of Object.entries(this.context)) {
      if (typeof value === 'string' && value.length > 500) {
        this.context[key] = `${value.substring(0, 500)}... (truncated, total length: ${value.length})`;
      }
    }
  }
} 