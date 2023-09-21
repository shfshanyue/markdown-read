import { JSDOM } from 'jsdom'
export interface ReadOptions {
  headers?: Record<string, any>
}

async function getDocument(url: string, { headers = {} }: ReadOptions = {}) {
  const html = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      ...headers
    }
  }).then(res => res.text())
  const doc = new JSDOM(html, {
    url
  })
  return doc.window.document
}

export { getDocument }