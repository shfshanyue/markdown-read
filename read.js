const { Readability } = require('@mozilla/readability');
const fetch = require('isomorphic-unfetch')
const JSDOM = require('jsdom').JSDOM

async function read (url) {
  const html = await fetch(url).then(res => res.text())
  const doc = new JSDOM(html)
  const reader = new Readability(doc.window.document, {
    keepClasses: true,
    debug: true
  })

  Readability.prototype.FLAG_STRIP_UNLIKELYS = 0

  // Readability.prototype.REGEXPS.unlikelyCandidates = /-ad-|ai2html|banner|breadcrumbs|combx|comment|community|cover-wrap|disqus|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-remote/i

  const article = reader.parse()

  return article
}

module.exports = read
