import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import fetch from 'isomorphic-unfetch'
import { platforms } from './platform'

export interface ReadOptions {
  debug?: boolean;
  headers?: Headers;
}

function handlePlatforms (document: Document) {
  for (const platform of platforms) {
    if (platform.filter(document)) {
      platform.processDocument(document)
    }
  }
}

async function read (url: string, { debug, headers }: ReadOptions = {}) {
  const html = await fetch(url, { headers }).then(res => res.text())
  const doc = new JSDOM(html, {
    url
  })
  const document = doc.window.document

  handlePlatforms(document)

  // Handle LazyLoad Image
  for (const img of Array.from(document.getElementsByTagName('img'))) {
    if (!img.getAttribute('src')) {
      img.setAttribute('src', img.dataset?.src || '')
    }
  }

  const reader = new Readability(document, {
    keepClasses: true,
    debug,
    // debug: true
  });

  // avoid .extra remove
  (Readability.prototype as any).FLAG_STRIP_UNLIKELYS = 0

  // Readability.prototype.REGEXPS.unlikelyCandidates = /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i

  const article = reader.parse()

  return article
}

export { read }
