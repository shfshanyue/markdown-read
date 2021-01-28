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

turndownService.use([tables])
// turndownService.addRule('extendHashLink', {
//   filter (node, options) {
//     return (
//       node.nodeName === 'A' && node.getAttribute('href').startsWith('#')
//     )
//   },

//   replacement (content) {
//     return content
//   }
// })

async function mdRead (url) {
  const text = await read(url)
  if (!text) { return '' }
  const md = turndownService.turndown(text.content)
  return md
}

module.exports = mdRead
