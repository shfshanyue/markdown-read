import TurndownService from 'turndown'
import { LANGUAGES } from './language'

const { tables } = require('turndown-plugin-gfm')

function detectLanguage (className: string): string {
  for (const lang of LANGUAGES) {
    if (new RegExp(`\\b${lang}\\b`).test(className)) {
      return lang
    }
  }
  return 'auto'
}

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
    const className = [node.className, node.firstElementChild?.className].join(' ')
    const language = 
      node.getAttribute('data-lang') ||
      (className.match(/language-(\S+)/) ? RegExp.$1 : null) ||
      detectLanguage(className)
    const code = node.textContent || ''
    const fence = options.fence

    return (
      '\n\n' + fence + ' ' + language + '\n' +
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
