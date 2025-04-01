import { ReadOptions, getDocument } from './document'
import { readability, type ReadabilityContent } from './readability'
import { turndown, TurndownOptions } from './turndown'
import { MarkdownError } from './lib/errors';

/**
 * Utility function to safely pick properties from an object.
 * 
 * @param obj - The source object to pick properties from
 * @param paths - Array of property paths to extract
 * @returns A new object containing only the specified properties
 */
function pick<T, K extends keyof T>(obj: T | undefined, paths: K[] = []): Partial<T> {
  if (!obj) {
    return {};
  }
  
  return paths.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = obj[key];
    }
    return acc;
  }, {} as Partial<T>);
}

/**
 * Result of converting HTML content to Markdown.
 */
export interface MarkdownContent extends ReadabilityContent {
  /** The converted markdown content */
  markdown: string;
  /** Length of the markdown content in characters */
  length: number;
}

/**
 * Options for the markdown conversion process.
 */
export interface MarkdownOptions extends ReadOptions, TurndownOptions {}

/**
 * Converts a web page to Markdown format
 * 
 * @param url - The URL of the web page to convert
 * @param options - Optional settings for document retrieval and conversion
 * @returns A Promise that resolves to a MarkdownContent object
 * @throws {MarkdownError} When URL is invalid or when document retrieval fails
 * @throws {Error} When readability parsing or markdown conversion fails
 * 
 * @example
 * ```typescript
 * try {
 *   const result = await markdown('https://example.com', { timeout: 5000 });
 *   console.log(result.markdown);
 * } catch (error) {
 *   console.error('Conversion failed:', error.message);
 * }
 * ```
 */
async function markdown(url: string, options?: MarkdownOptions): Promise<MarkdownContent> {
  try {
    // Pick only the options relevant for document retrieval
    const readOptions = pick(options, ['headers', 'fetcher', 'timeout', 'retries'] as const);
    
    // Fetch the document from the given URL
    const doc = await getDocument(url, readOptions);
    
    // Extract readable content using readability
    const data = await readability(doc);
    
    // If readability fails, throw an error
    if (!data) { 
      throw MarkdownError.extractionFailed(url, doc.title);
    }

    // Convert HTML content to markdown
    const markdownContent = turndown(data.content, options);
    
    if (!markdownContent || markdownContent.trim() === '') {
      throw MarkdownError.emptyOutput(url, options as Record<string, unknown>);
    }
    
    return {
      ...data,
      markdown: markdownContent,
      length: markdownContent.length,
      url
    };
  } catch (error) {
    // If the error is already a MarkdownError, rethrow it
    if (error instanceof MarkdownError) {
      throw error;
    }
    
    // Otherwise, wrap it in a MarkdownError with context and additional info
    const contextInfo: Record<string, unknown> = {};
    
    // Add options to context for debugging
    if (options) {
      contextInfo.options = options;
    }
    
    throw MarkdownError.processFailed(
      url, 
      error instanceof Error ? error : new Error(String(error)),
      contextInfo
    );
  }
}

export { markdown }
