const { Readability } = require('@mozilla/readability');
const fetch = require('isomorphic-unfetch')
const JSDOM = require('jsdom').JSDOM

async function read (url) {
  const html = await fetch(url).then(res => res.text())
  const doc = new JSDOM(html)
  const reader = new Readability(doc.window.document, {
    keepClasses: true
  })
  const article = reader.parse()

  return article
}

module.exports = read
