import { BaseError, ErrorContext } from './BaseError';

/**
 * Context information specific to markdown conversion
 */
export interface MarkdownErrorContext extends ErrorContext {
  /** URL of the document being converted */
  url: string;
  /** Document title (if available) */
  title?: string;
  /** HTML content that was being processed */
  html?: string;
  /** Partial markdown output (if available) */
  markdown?: string;
  /** Options that were used for the conversion */
  options?: Record<string, unknown>;
}

/**
 * Error thrown during the overall markdown conversion process
 */
export class MarkdownError extends BaseError {
  /**
   * Create a new MarkdownError
   * 
   * @param message - Human-readable error message
   * @param context - Additional context information for debugging
   * @param cause - The original error that caused this error
   */
  constructor(
    message: string,
    context: MarkdownErrorContext,
    cause?: Error
  ) {
    super(message, context, cause);
  }

  /**
   * Factory method to create a MarkdownError for empty markdown output
   * 
   * @param url - The URL of the document
   * @param options - The options that were used for conversion
   */
  static emptyOutput(
    url: string,
    options?: Record<string, unknown>
  ): MarkdownError {
    return new MarkdownError(
      `Generated empty markdown from ${url}`,
      {
        url,
        options,
      }
    );
  }

  /**
   * Factory method to create a MarkdownError for extraction failures
   * 
   * @param url - The URL of the document
   * @param title - The title of the document (if available)
   * @param cause - The original error that caused the failure
   */
  static extractionFailed(
    url: string,
    title?: string,
    cause?: Error
  ): MarkdownError {
    return new MarkdownError(
      `Failed to extract readable content from ${url}`,
      {
        url,
        title,
      },
      cause
    );
  }

  /**
   * Factory method to create a MarkdownError for conversion failures
   * 
   * @param url - The URL of the document
   * @param html - The HTML that failed to convert (if available)
   * @param cause - The original error that caused the failure
   */
  static conversionFailed(
    url: string,
    html?: string,
    cause?: Error
  ): MarkdownError {
    return new MarkdownError(
      `Failed to convert ${url} to markdown`,
      {
        url,
        html,
      },
      cause
    );
  }

  /**
   * Factory method to create a MarkdownError for internal process failures
   * 
   * @param url - The URL of the document
   * @param cause - The original error that caused the failure
   * @param context - Additional context information
   */
  static processFailed(
    url: string,
    cause: Error,
    context: Partial<Omit<MarkdownErrorContext, 'url'>> = {}
  ): MarkdownError {
    return new MarkdownError(
      `Markdown conversion process failed for ${url}: ${cause.message}`,
      {
        url,
        ...context,
      },
      cause
    );
  }
} 