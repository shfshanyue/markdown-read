import { Readability } from '@mozilla/readability'
import { platforms } from './platform/index'

export interface ReadabilityContent {
  url: string;
  title: string;
  content: string;
  length?: number;
  excerpt?: string;
  byline?: string;
  dir?: string;
  siteName?: string;
  lang?: string;
  publishedTime?: string;
}


const noop = () => { }
(Readability.prototype as any).FLAG_STRIP_UNLIKELYS = 0;
(Readability.prototype as any)._cleanHeaders = noop;
(Readability.prototype as any)._headerDuplicatesTitle = () => false;

function handlePlatforms(document: Document) {
  for (const platform of platforms) {
    const url = new URL(document.URL)
    if (platform.filter(document, url)) {
      return platform
    }
  }
  return null
}

/**
 * Extracts readable content from a given HTML document.
 * 
 * @param document - The HTML Document object to process.
 * @param options - Configuration options for the readability process.
 * @param options.debug - Whether to enable debug mode. Default is false.
 * @returns A Promise that resolves to a ReadabilityContent object or null if parsing fails.
 * 
 * This function performs the following steps:
 * 1. Handles lazy-loaded images by setting their src attribute.
 * 2. Extracts the byline from meta tags.
 * 3. Processes the document using platform-specific handlers if applicable.
 * 4. If the platform doesn't require skipping, it uses Mozilla's Readability to parse the content.
 * 5. Returns the parsed article content or the full HTML content if skipped.
 */
async function readability(document: Document, { debug }: { debug: boolean } = { debug: false }): Promise<ReadabilityContent | null> {
  const url = document.URL;

  // Handle LazyLoad Image
  for (const img of Array.from(document.getElementsByTagName('img'))) {
    if (!img.getAttribute('src')) {
      // readbility 将会拿到 lazy 的 class，重新处理懒加载
      img.removeAttribute('class')
      img.setAttribute('src', img.dataset?.src || '')
    }
  }

  const byline = document.querySelector('meta[itemprop=name]')?.getAttribute('content') || ''

  const platform = handlePlatforms(document)
  await platform?.processDocument(document)

  // Is skip Readaility process
  const skip = platform?.skip

  if (skip) {
    return {
      url,
      title: document.title,
      content: document.body.innerHTML,
      byline
    }
  }
  const reader = new Readability(document, {
    keepClasses: true,
    debug,
  })

  const article = reader.parse()
  if (!article) {
    return null
  }
  if (byline) {
    article.byline = byline
  }
  return {
    ...article,
    url
  }
}

export { readability }
