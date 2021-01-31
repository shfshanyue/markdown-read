const read = require('./read')
const readMdFromText = require('./md-read-text')

async function readMd (url, options) {
  const text = await read(url, options)
  if (!text) { return '' }
  return readMdFromText(text.content)
}

module.exports = readMd
