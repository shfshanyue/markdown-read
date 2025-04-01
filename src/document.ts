import { JSDOM } from 'jsdom'
import { DocumentError } from './lib/errors';

/**
 * Options for fetching and parsing HTML documents.
 * @interface ReadOptions
 */
export interface ReadOptions {
  /** Custom HTTP headers to include in the request */
  headers?: Record<string, string>;
  /** Custom fetcher function to override the default behavior */
  fetcher?: (url: string) => Promise<string>;
  /** Request timeout in milliseconds (default: 30000ms) */
  timeout?: number;
  /** Maximum number of retries for failed requests (default: 0) */
  retries?: number;
}

/**
 * Validates if a string is a properly formatted URL.
 * 
 * @param url - The string to validate as URL
 * @returns True if the URL is valid, false otherwise
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Fetches and parses an HTML document from a given URL.
 * 
 * @param url - The URL of the webpage to fetch.
 * @param options - Optional configuration for the request.
 * @param options.headers - Additional headers to include in the request.
 * @param options.fetcher - Custom function to fetch the HTML content.
 * @param options.timeout - Request timeout in milliseconds (default: 30000ms).
 * @param options.retries - Maximum number of retries for failed requests (default: 0).
 * @returns A Promise that resolves to the parsed Document object.
 * @throws {DocumentError} When URL is invalid, network errors occur, or parsing fails.
 */
async function getDocument(
  url: string, 
  { headers = {}, fetcher, timeout = 30000, retries = 0 }: ReadOptions = {}
): Promise<Document> {
  // Validate URL format
  if (!isValidUrl(url)) {
    throw DocumentError.invalidUrl(url);
  }

  // Default fetcher with timeout and retry logic
  const defaultFetcher = async (url: string): Promise<string> => {
    const lowercaseHeaders = Object.fromEntries(
      Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
    );
    
    let retryCount = 0;
    let lastError: Error | null = null;

    while (retryCount <= retries) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(url, {
          headers: {
            'user-agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            ...lowercaseHeaders
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          // Extract response headers for better debugging
          const responseHeaders: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });
          
          throw DocumentError.fromHttpError(
            url, 
            response.status, 
            response.statusText,
            lowercaseHeaders,
            responseHeaders
          );
        }
        
        return await response.text();
      } catch (error) {
        // If we already have a DocumentError, just rethrow it
        if (error instanceof DocumentError) {
          throw error;
        }
        
        lastError = error instanceof Error ? error : new Error(String(error));
        retryCount++;
        
        // Don't retry if we've reached max retries
        if (retryCount > retries) {
          break;
        }
        
        // Don't retry if it's an abort error (timeout)
        if (lastError.name === 'AbortError') {
          throw DocumentError.fromFetchError(url, lastError, lowercaseHeaders, retryCount);
        }
        
        // Wait before retrying (simple exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
    
    // If we got here, all retries failed
    throw DocumentError.fromFetchError(
      url, 
      lastError ?? new Error('Unknown error during fetch'), 
      lowercaseHeaders,
      retryCount
    );
  };

  const htmlFetcher = fetcher ?? defaultFetcher;
  
  try {
    const html = await htmlFetcher(url);
    
    if (!html || html.trim() === '') {
      throw DocumentError.emptyContent(url);
    }
    
    const dom = new JSDOM(html, { url });
    return dom.window.document;
  } catch (error) {
    // If the error is already a DocumentError, rethrow it
    if (error instanceof DocumentError) {
      throw error;
    }
    
    // Otherwise, wrap it in a DocumentError with context
    throw DocumentError.fromFetchError(
      url, 
      error instanceof Error ? error : new Error(String(error)),
      headers
    );
  }
}

export { getDocument }