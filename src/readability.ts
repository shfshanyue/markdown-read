import { Readability } from '@mozilla/readability'
import { platforms } from './platform/index'

interface Content {
  title: string,
  content: string,
  byline: string
}

const noop = () => { }
(Readability.prototype as any).FLAG_STRIP_UNLIKELYS = 0;
(Readability.prototype as any)._cleanHeaders = noop;
(Readability.prototype as any)._headerDuplicatesTitle = () => false;

function handlePlatforms(document: Document) {
  for (const platform of platforms) {
    if (platform.filter(document)) {
      return platform
    }
  }
  return null
}

function readability(document: Document, { debug }: { debug: boolean } = { debug: false }): Content | null {
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
  platform?.processDocument(document)

  // Is skip Readaility process
  const skip = platform?.skip

  if (skip) {
    return {
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
  if (article && byline) {
    article.byline = byline
  }

  return article
}

export { readability }
