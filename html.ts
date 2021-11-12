import { Readability } from '@mozilla/readability'
import { JSDOM } from 'jsdom'
import fetch from 'isomorphic-unfetch'
import { platforms } from './platform'

const noop = () => {}
(Readability.prototype as any).FLAG_STRIP_UNLIKELYS = 0;
(Readability.prototype as any)._cleanHeaders = noop;
(Readability.prototype as any)._headerDuplicatesTitle = () => false;

export interface ReadOptions {
  debug?: boolean;
  headers?: Record<string, any>
}

function handlePlatforms (document: Document) {
  for (const platform of platforms) {
    if (platform.filter(document)) {
      return platform
    }
  }
  return null
}

async function readHtml (url: string, { debug, headers = {} }: ReadOptions = {}) {
  const html = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36',
      ...headers
    }
  }).then(res => res.text())
  const doc = new JSDOM(html, {
    url
  })
  const document = doc.window.document

  // Handle LazyLoad Image
  for (const img of Array.from(document.getElementsByTagName('img'))) {
    if (!img.getAttribute('src')) {
      // readbility 将会拿到 lazy 的 class，重新处理懒加载
      img.removeAttribute('class')
      img.setAttribute('src', img.dataset?.src || '')
    }
  }

  const platform = handlePlatforms(document)
  platform?.processDocument(document)

  // Is skip Readaility process
  const skip = platform?.skip

  if (skip) {
    return {
      title: document.title,
      content: document.body.innerHTML,
      textContent: document.body.textContent
    }
  }
  const reader = new Readability(document, {
    keepClasses: true,
    debug,
    // debug: true
  });
  // avoid .extra remove
  // Readability.prototype.REGEXPS.unlikelyCandidates = /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i

  const article = reader.parse()

  return article
}

export { readHtml }
