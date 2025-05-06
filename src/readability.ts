import { Readability } from '@mozilla/readability'
import { platforms } from './platform/index'
import { ReadabilityError } from './lib/errors';
import { JSDOMDocument } from './document';

/**
 * Represents the structured content extracted from a web page.
 */
export interface ReadabilityContent {
  /** The URL of the original page */
  url: string;
  /** The article title */
  title?: string;
  /** The article content as HTML */
  content: string;
  /** The length of the content in characters */
  length?: number;
  /** A short excerpt from the article */
  excerpt?: string;
  /** The author of the article */
  byline?: string;
  /** The reading direction (ltr or rtl) */
  dir?: string;
  /** The name of the website */
  siteName?: string;
  /** The language of the content */
  lang?: string;
  /** The publication date/time of the article */
  publishedTime?: string;
}

/**
 * Configuration options for the readability process.
 */
export interface ReadabilityOptions {
  /** Whether to enable debug mode */
  debug?: boolean;
  /** Skip image processing */
  skipImages?: boolean;
}

// 兼容类型，可以同时支持浏览器 Document 和 JSDOM Document
export type CompatDocument = Document | JSDOMDocument;

// Disable some Readability features that might interfere with our needs
const noop = () => { };
(Readability.prototype as any).FLAG_STRIP_UNLIKELYS = 0;
(Readability.prototype as any)._cleanHeaders = noop;
(Readability.prototype as any)._headerDuplicatesTitle = () => false;

/**
 * Checks if the document matches any of the defined platform handlers.
 * 
 * @param document - The Document object to check
 * @returns The matching platform handler or null if none match
 */
function handlePlatforms(document: CompatDocument) {
  const url = new URL(document.URL);
  
  for (const platform of platforms) {
    if (platform.filter(document, url)) {
      return platform;
    }
  }
  
  return null;
}

/**
 * Processes images in the document to handle lazy loading.
 * 
 * @param document - The Document object to process
 */
function handleLazyImages(document: CompatDocument): void {
  // Find all img elements
  const images = Array.from(document.getElementsByTagName('img'));
  
  for (const img of images) {
    if (!img.getAttribute('src')) {
      // Remove class to avoid interference with readability's lazy load handling
      img.removeAttribute('class');
      
      // Check for data-src attribute (common for lazy-loaded images)
      const dataSrc = img.dataset?.src;
      if (dataSrc) {
        img.setAttribute('src', dataSrc);
      }
    }
  }
}

/**
 * Check if an object is a valid Document instance (works in both browser and Node.js environments)
 * 
 * @param obj - The object to check
 * @returns True if the object is a valid document, false otherwise
 */
function isValidDocument(obj: any): obj is CompatDocument {
  return obj && 
    typeof obj === 'object' && 
    'nodeType' in obj && 
    'documentElement' in obj &&
    'URL' in obj &&
    'querySelector' in obj;
}

/**
 * Extracts readable content from a given HTML document.
 * 
 * @param document - The HTML Document object to process.
 * @param options - Configuration options for the readability process.
 * @returns A Promise that resolves to a ReadabilityContent object.
 * @throws {ReadabilityError} When parsing fails or the document is invalid.
 * 
 * This function performs the following steps:
 * 1. Handles lazy-loaded images by setting their src attribute.
 * 2. Extracts the byline from meta tags.
 * 3. Processes the document using platform-specific handlers if applicable.
 * 4. If the platform doesn't require skipping, it uses Mozilla's Readability to parse the content.
 * 5. Returns the parsed article content or the full HTML content if skipped.
 * 
 * @example
 * ```typescript
 * try {
 *   const document = await getDocument('https://example.com');
 *   const content = await readability(document);
 *   console.log(content.title);
 * } catch (error) {
 *   console.error('Extraction failed:', error.message);
 * }
 * ```
 */
async function readability(
  document: CompatDocument, 
  { debug = false, skipImages = false }: ReadabilityOptions = {}
): Promise<ReadabilityContent> {
  if (!document || !isValidDocument(document)) {
    throw ReadabilityError.invalidDocument();
  }
  
  try {
    const url = document.URL;
    
    // Process lazy-loaded images unless skipped
    if (!skipImages) {
      handleLazyImages(document);
    }
    
    // Extract byline from meta tag if available
    const byline = document.querySelector('meta[itemprop=name]')?.getAttribute('content') ?? '';
    
    // Check if the document matches a specific platform
    const platform = handlePlatforms(document);
    
    // Apply platform-specific processing if available
    if (platform) {
      try {
        await platform.processDocument?.(document);
      } catch (error) {
        if (error instanceof Error) {
          // Find platform name through its index in the platforms array
          const platformName = platforms.findIndex(p => p === platform) >= 0 
            ? Object.keys(platforms).find(key => platforms[key as any] === platform) || 'unknown platform'
            : 'unknown platform';
          
          throw ReadabilityError.platformError(
            url,
            platformName,
            error
          );
        }
      }
    }
    
    // Skip Readability if the platform handler requires it
    if (platform?.skip) {
      return {
        url,
        title: document.title,
        content: document.body.innerHTML,
        byline: byline || undefined
      };
    }
    
    // Create a Readability parser
    const reader = new Readability(document, {
      keepClasses: true,
      debug,
    });
    
    // Parse the document to extract readable content
    const article = reader.parse();
    
    if (!article) {
      throw ReadabilityError.extractionFailed(url, document);
    }
    
    // Add the byline if we extracted one
    if (byline && !article.byline) {
      article.byline = byline;
    }
    
    // Return the article with the URL added
    return {
      url,
      title: article.title || document.title || 'Untitled',
      content: article.content || '',
      length: article.length || undefined,
      excerpt: article.excerpt || undefined,
      byline: article.byline || undefined,
      dir: article.dir || undefined,
      siteName: article.siteName || undefined,
      lang: article.lang || undefined,
      publishedTime: article.publishedTime || undefined
    };
  } catch (error) {
    // If the error is already a ReadabilityError, rethrow it
    if (error instanceof ReadabilityError) {
      throw error;
    }
    
    // Otherwise, wrap it in a ReadabilityError with context
    const contextHtml = document.documentElement.outerHTML;
    
    throw new ReadabilityError(
      `Readability extraction failed: ${error instanceof Error ? error.message : String(error)}`,
      {
        url: document.URL,
        title: document.title,
        html: contextHtml,
        debugMode: debug,
      },
      error instanceof Error ? error : undefined
    );
  }
}

export { readability }
