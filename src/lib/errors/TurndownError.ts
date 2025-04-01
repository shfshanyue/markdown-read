import { BaseError, ErrorContext } from './BaseError';

/**
 * Context information specific to Turndown conversion
 */
export interface TurndownErrorContext extends ErrorContext {
  /** The HTML content being converted */
  html?: string;
  /** The partial markdown output (if conversion partially succeeded) */
  markdown?: string;
  /** Turndown options that were used */
  options?: Record<string, unknown>;
}

/**
 * Error thrown when HTML to Markdown conversion fails
 */
export class TurndownError extends BaseError {
  /**
   * Create a new TurndownError
   * 
   * @param message - Human-readable error message
   * @param context - Additional context information for debugging
   * @param cause - The original error that caused this error
   */
  constructor(
    message: string,
    context: TurndownErrorContext = {},
    cause?: Error
  ) {
    super(message, context, cause);
  }

  /**
   * Factory method to create a TurndownError for invalid HTML input
   * 
   * @param html - The invalid HTML input (or its type if not a string)
   */
  static invalidInput(html: unknown): TurndownError {
    const htmlType = typeof html;
    const context: TurndownErrorContext = {};
    
    // Only include the HTML in context if it's actually a string
    if (htmlType === 'string') {
      context.html = html as string;
    }
    
    return new TurndownError(
      `Invalid HTML input: ${htmlType !== 'string' ? htmlType : 'empty string'}`,
      context
    );
  }

  /**
   * Factory method to create a TurndownError for conversion failures
   * 
   * @param html - The HTML that failed to convert
   * @param options - The Turndown options that were used
   * @param cause - The original error (if any)
   */
  static conversionFailed(
    html: string,
    options?: Record<string, unknown>,
    cause?: Error
  ): TurndownError {
    return new TurndownError(
      'Failed to convert HTML to Markdown',
      {
        html,
        options,
      },
      cause
    );
  }

  /**
   * Factory method to create a TurndownError for rule application failures
   * 
   * @param ruleName - The name of the rule that failed
   * @param html - The HTML being processed when the rule failed
   * @param cause - The original error (if any)
   */
  static ruleApplicationFailed(
    ruleName: string,
    html: string,
    cause?: Error
  ): TurndownError {
    return new TurndownError(
      `Failed to apply Turndown rule: ${ruleName}`,
      {
        html,
      },
      cause
    );
  }
} 