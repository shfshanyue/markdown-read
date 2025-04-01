import { BaseError, ErrorContext } from './BaseError';

/**
 * Context information specific to readability extraction
 */
export interface ReadabilityErrorContext extends ErrorContext {
  /** URL of the document being processed */
  url: string;
  /** Document title (if available) */
  title?: string;
  /** HTML content that was being processed */
  html?: string;
  /** Debug mode status */
  debugMode?: boolean;
  /** Platform that was detected (if any) */
  platform?: string;
}

/**
 * Error thrown when extracting readable content fails
 */
export class ReadabilityError extends BaseError {
  /**
   * Create a new ReadabilityError
   * 
   * @param message - Human-readable error message
   * @param context - Additional context information for debugging
   * @param cause - The original error that caused this error
   */
  constructor(
    message: string, 
    context: ReadabilityErrorContext,
    cause?: Error
  ) {
    super(message, context, cause);
  }

  /**
   * Factory method to create a ReadabilityError for extraction failures
   * 
   * @param url - The URL of the document being processed
   * @param document - The document that failed to be processed
   * @param cause - The original error (if any)
   */
  static extractionFailed(
    url: string,
    document: Document,
    cause?: Error
  ): ReadabilityError {
    return new ReadabilityError(
      `Failed to extract readable content from ${url}`,
      {
        url,
        title: document.title,
        html: document.documentElement.outerHTML,
      },
      cause
    );
  }

  /**
   * Factory method to create a ReadabilityError for invalid document
   * 
   * @param context - Additional context information
   */
  static invalidDocument(context: Partial<ReadabilityErrorContext> = {}): ReadabilityError {
    return new ReadabilityError(
      'Invalid document provided to readability function',
      {
        url: context.url || 'unknown',
        ...context,
      }
    );
  }

  /**
   * Factory method to create a ReadabilityError for platform-specific issues
   * 
   * @param url - The URL of the document
   * @param platformName - The name of the platform
   * @param cause - The original error (if any)
   */
  static platformError(
    url: string,
    platformName: string,
    cause?: Error
  ): ReadabilityError {
    return new ReadabilityError(
      `Platform-specific processing failed for ${platformName}`,
      {
        url,
        platform: platformName,
      },
      cause
    );
  }
} 