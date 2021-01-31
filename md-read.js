const read = require('./read')
const TurndownService = require('turndown')
const { tables } = require('turndown-plugin-gfm')

const turndownService = new TurndownService({
  emDelimiter: '*',
  codeBlockStyle: 'fenced',
  fence: '```',
  headingStyle: 'atx',
  bulletListMarker: '+'
})

turndownService.use([tables])

turndownService.addRule('extendCodeBlock', {
  filter (node, options) {
    return (
      options.codeBlockStyle === 'fenced' &&
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    )
  },

  replacement (content, node, options) {
    const className = node.getAttribute('class') || node.firstChild.getAttribute('class') || ''
    const language = (className.match(/language-(\S+)/) || [null, ''])[1]
    const code = node.firstChild.textContent

    const fence = options.fence

    return (
      '\n\n' + fence + language + '\n' +
      code.replace(/\n$/, '') +
      '\n' + fence + '\n\n'
    )
  }
})

// turndownService.addRule('extendImage', {
//   filter: 'img',
//   replacement (content, node) {
//     const alt = cleanAttribute(node.getAttribute('alt'))
//     const src = node.getAttribute('src') || ''
//     const title = cleanAttribute(node.getAttribute('title'))
//     const titlePart = title ? ' "' + title + '"' : ''
//     return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
//   }
// })

async function readMd (url, options) {
  const text = await read(url, options)
  if (!text) { return '' }
  return readMdFromText(text.content)
}

function readMdFromText (text) {
  return turndownService.turndown(text)
}

module.exports = {
  readMd,
  readMdFromText
}
