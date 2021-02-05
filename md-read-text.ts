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
      node.nodeName === 'CODE' &&
      (node.parentElement?.nodeName === 'PRE' || node.textContent?.includes('\n'))
    )
  },

  replacement (content, node, options) {
    node = node as HTMLElement
    const className = node.getAttribute('class') || node.parentElement?.getAttribute('class') || ''
    const language = (className.match(/language-(\S+)/) || [null, ''])[1]
    const code = node.textContent || ''
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
