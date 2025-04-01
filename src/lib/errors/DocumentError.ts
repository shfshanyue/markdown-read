import { BaseError, ErrorContext } from './BaseError';

/**
 * Context information specific to document fetching and parsing
 */
export interface DocumentErrorContext extends ErrorContext {
  /** URL that was being fetched */
  url: string;
  /** HTTP status code (if available) */
  statusCode?: number;
  /** HTTP status text (if available) */
  statusText?: string;
  /** Request headers that were used */
  requestHeaders?: Record<string, string>;
  /** Response headers that were received */
  responseHeaders?: Record<string, string>;
  /** Number of retry attempts made */
  retryAttempts?: number;
}

/**
 * Error thrown when document fetching or parsing fails
 */
export class DocumentError extends BaseError {
  /**
   * Create a new DocumentError
   * 
   * @param message - Human-readable error message
   * @param context - Additional context information for debugging
   * @param cause - The original error that caused this error
   */
  constructor(
    message: string,
    context: DocumentErrorContext,
    cause?: Error
  ) {
    super(message, context, cause);
  }

  /**
   * Factory method to create a DocumentError from a fetch error
   * 
   * @param url - The URL that was being fetched
   * @param error - The original fetch error
   * @param headers - The request headers that were used
   * @param retryAttempts - Number of retry attempts made
   */
  static fromFetchError(
    url: string, 
    error: Error, 
    headers?: Record<string, string>,
    retryAttempts?: number
  ): DocumentError {
    let message = `Failed to fetch document from ${url}`;
    
    // Add more specifics based on error type
    if (error.name === 'AbortError') {
      message = `Request timeout while fetching ${url}`;
    } else if (error.message.includes('ENOTFOUND')) {
      message = `Domain not found: ${url}`;
    } else if (error.message.includes('ECONNREFUSED')) {
      message = `Connection refused: ${url}`;
    }
    
    return new DocumentError(
      message,
      {
        url,
        requestHeaders: headers,
        retryAttempts,
      },
      error
    );
  }

  /**
   * Factory method to create a DocumentError from an HTTP error
   * 
   * @param url - The URL that was being fetched
   * @param statusCode - The HTTP status code
   * @param statusText - The HTTP status text
   * @param requestHeaders - The request headers that were used
   * @param responseHeaders - The response headers that were received
   */
  static fromHttpError(
    url: string,
    statusCode: number,
    statusText: string,
    requestHeaders?: Record<string, string>,
    responseHeaders?: Record<string, string>
  ): DocumentError {
    return new DocumentError(
      `HTTP error ${statusCode} (${statusText}) fetching ${url}`,
      {
        url,
        statusCode,
        statusText,
        requestHeaders,
        responseHeaders,
      }
    );
  }

  /**
   * Factory method to create a DocumentError for an invalid URL
   * 
   * @param url - The invalid URL string
   */
  static invalidUrl(url: string): DocumentError {
    return new DocumentError(
      `Invalid URL: ${url}`,
      { url }
    );
  }

  /**
   * Factory method to create a DocumentError for empty HTML content
   * 
   * @param url - The URL that returned empty content
   */
  static emptyContent(url: string): DocumentError {
    return new DocumentError(
      `Received empty HTML content from ${url}`,
      { url }
    );
  }
} 