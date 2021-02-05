import TurndownService from 'turndown'
const { tables } = require('turndown-plugin-gfm')

const turndownService = new TurndownService({
  emDelimiter: '*',
  codeBlockStyle: 'fenced',
  fence: '```',
  headingStyle: 'atx',
  bulletListMarker: '+'
})

turndownService.use([tables])

turndownService.addRule('autoLanguage', {
  filter (node, options) {
    return Boolean(
      options.codeBlockStyle === 'fenced' &&
      node.nodeName === 'PRE' &&
      node.firstChild &&
      node.firstChild.nodeName === 'CODE'
    )
  },

  replacement (content, node, options) {
    node = node as HTMLElement
    const firstChild = (node.firstChild as any)
    const className = node.getAttribute('class') || firstChild?.getAttribute('class') || ''
    const language = (className.match(/language-(\S+)/) || [null, ''])[1]
    const code = firstChild?.textContent || ''

    const fence = options.fence

    return (
      '\n\n' + fence + language + '\n' +
      code.replace(/\n$/, '') +
      '\n' + fence + '\n\n'
    )
  }
})

turndownService.addRule('removeHashLink', {
  filter (node, options) {
    return Boolean(node.nodeName === 'A' && node.getAttribute('href')?.startsWith('#'))
  },
  replacement (content, node) {
    return ''
  }
})

function readMdFromText (text: string): string {
  return turndownService.turndown(text)
}

export { readMdFromText }
