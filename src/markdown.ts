import { ReadOptions, getDocument } from './document'
import { readability, type ReadabilityContent } from './readability'
import { turndown, TurndownOptions } from './turndown'

function pick<T>(obj: T, paths: string[] = []): Partial<T> {
  if (!obj) {
    return {}
  }
  return paths.reduce((acc, key) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      acc[key] = (obj as any)[key]
    }
    return acc
  }, {} as any)
}


export interface MarkdownContent extends ReadabilityContent {
  markdown: string;
}

export interface MarkdownOptions extends ReadOptions, TurndownOptions {}

/**
 * Converts a web page to Markdown format
 * @param url - The URL of the web page to convert
 * @param options - Optional settings for document retrieval
 * @returns A Promise that resolves to a MarkdownContent object or null if conversion fails
 */
async function markdown(url: string, options?: MarkdownOptions): Promise<MarkdownContent | null> {
  // Fetch the document from the given URL
  const readOptions = pick(options, ['headers', 'fetcher'])
  const doc = await getDocument(url, readOptions)
  
  // Extract readable content using readability
  const data = await readability(doc)
  
  // If readability fails, return null
  if (!data) { return null }

  const markdown = turndown(data.content, options)
  
  return {
    ...data,
    markdown,
    length: markdown.length,
    url
  }
}

export { markdown }
