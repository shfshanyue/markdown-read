const { Readability } = require('@mozilla/readability');
const fetch = require('isomorphic-unfetch')
const JSDOM = require('jsdom').JSDOM

async function read (url, { debug, headers } = {}) {
  const html = await fetch(url, { headers }).then(res => res.text())
  const doc = new JSDOM(html, {
    url
  })
  const document = doc.window.document

  // Handle LazyLoad Image
  for (const img of Array.from(document.getElementsByTagName('img'))) {
    if (!img.getAttribute('src')) {
      img.setAttribute('src', img.dataset.src)
    }
  }

  const reader = new Readability(document, {
    keepClasses: true,
    debug,
    // debug: true
  })

  Readability.prototype.FLAG_STRIP_UNLIKELYS = 0

  // Readability.prototype.REGEXPS.unlikelyCandidates = /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i

  const article = reader.parse()

  return article
}

module.exports = read
