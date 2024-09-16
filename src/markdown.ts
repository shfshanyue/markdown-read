import { ReadOptions, getDocument } from './document'
import { readability, type ReadabilityContent } from './readability'
import { turndown } from './turndown'

interface MarkdownContent extends ReadabilityContent {
  markdown: string;
}

/**
 * Converts a web page to Markdown format
 * @param url - The URL of the web page to convert
 * @param options - Optional settings for document retrieval
 * @returns A Promise that resolves to a MarkdownContent object or null if conversion fails
 */
async function markdown(url: string, options?: ReadOptions): Promise<MarkdownContent | null> {
  // Fetch the document from the given URL
  const doc = await getDocument(url, options)
  
  // Extract readable content using readability
  const data = await readability(doc)
  
  // If readability fails, return null
  if (!data) { return null }
  
  // Convert the HTML content to Markdown and return the result
  return {
    markdown: turndown(data.content),
    ...data
  }
}

export { markdown }
