/**
 * This file contains examples of how to use the error handling system.
 * It is not used in production but serves as documentation and reference.
 */

import { markdown } from '../../markdown';
import { 
  MarkdownError, 
  DocumentError, 
  ReadabilityError, 
  TurndownError,
  formatError,
  logError,
  assert
} from './index';

/**
 * Example: Try to convert a URL to markdown with proper error handling
 */
async function convertWithErrorHandling(url: string): Promise<string> {
  try {
    const result = await markdown(url, { timeout: 10000 });
    return result.markdown;
  } catch (error) {
    // Handle different error types specifically
    if (error instanceof DocumentError) {
      console.error(`Document error: ${formatError(error)}`);
      // Maybe retry with different options
    } else if (error instanceof ReadabilityError) {
      console.error(`Readability error: ${formatError(error)}`);
      // Maybe try a platform-specific approach
    } else if (error instanceof TurndownError) {
      console.error(`Markdown conversion error: ${formatError(error)}`);
      // Maybe try a different conversion strategy
    } else if (error instanceof MarkdownError) {
      console.error(`Overall process error: ${formatError(error)}`);
      // Generic error handling
    } else {
      console.error(`Unknown error: ${error instanceof Error ? error.message : String(error)}`);
    }
    
    // Throw a user-friendly error
    throw new Error(`Failed to convert ${url} to markdown. Please try again later.`);
  }
}

/**
 * Example: Use assertions for validation
 */
function validateOptions(options: Record<string, unknown>): void {
  assert(
    typeof options.url === 'string', 
    'document', 
    'URL must be a string', 
    { providedType: typeof options.url }
  );
  
  if (options.timeout !== undefined) {
    assert(
      typeof options.timeout === 'number' && options.timeout > 0,
      'document',
      'Timeout must be a positive number',
      { providedTimeout: options.timeout }
    );
  }
}

/**
 * Example: Custom error creation and logging
 */
function performOperation(data: unknown): void {
  try {
    // Some operation that might fail
    if (!data) {
      throw new Error('Data is required');
    }
  } catch (error) {
    // Create a custom error with context
    const customError = new MarkdownError(
      'Operation failed',
      {
        url: 'https://example.com',
        data: JSON.stringify(data),
        timestamp: new Date().toISOString()
      },
      error instanceof Error ? error : undefined
    );
    
    // Log the error with detailed information
    logError(customError, 'Critical:');
    
    // Handle the error appropriately
    throw customError;
  }
}

export { convertWithErrorHandling, validateOptions, performOperation } 