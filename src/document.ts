import { JSDOM } from 'jsdom'

export interface ReadOptions {
  headers?: Record<string, any>
  fetcher?: (url: string) => Promise<string>
}

/**
 * Fetches and parses an HTML document from a given URL.
 * 
 * @param url - The URL of the webpage to fetch.
 * @param options - Optional configuration for the request.
 * @param options.headers - Additional headers to include in the request.
 * @param options.fetcher - Custom function to fetch the HTML content.
 * @returns A Promise that resolves to the parsed Document object.
 */
async function getDocument(url: string, { headers = {}, fetcher }: ReadOptions = {}) {
  const defaultFetcher = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        ...headers
      }
    })
    return response.text()
  }

  const htmlFetcher = fetcher || defaultFetcher
  const html = await htmlFetcher(url)

  const doc = new JSDOM(html, { url })
  return doc.window.document
}

export { getDocument }