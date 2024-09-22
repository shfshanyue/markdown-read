import TurndownService from 'turndown'
import { detectLanguage } from './language'

const { tables } = require('turndown-plugin-gfm')

const turndownService = new TurndownService({
  emDelimiter: '*',
  codeBlockStyle: 'fenced',
  fence: '```',
  headingStyle: 'atx',
  bulletListMarker: '+'
})

turndownService.use([tables])

turndownService.addRule('fencedCodeBlockWithCodeElement', {
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
    const language = node.dataset?.language || node.dataset?.lang || node.getAttribute('data-language') || node.getAttribute('data-lang') || detectLanguage(className)
    const code = node.textContent || ''
    const fence = options.fence

    return (
      '\n\n' + fence + language + '\n' +
      code.replace(/\n$/, '') +
      '\n' + fence + '\n\n'
    )
  }
})

turndownService.addRule('fencedCodeBlockWithoutCodeElement', {
  filter (node, options) {
    return Boolean(
      options.codeBlockStyle === 'fenced' &&
      node.nodeName === 'PRE' &&
      node.firstChild?.nodeName !== 'CODE'
    )
  },

  replacement (content, node, options) {
    node = node as HTMLElement
    const className = [node.className, node.firstElementChild?.className, node.parentElement?.className].join(' ')
    const language = node.dataset?.language || node.dataset?.lang || node.getAttribute('data-language') || node.getAttribute('data-lang') || detectLanguage(className)
    const code = node.textContent || ''
    const fence = options.fence

    return (
      '\n\n' + fence + language + '\n' +
      code.replace(/\n$/, '') +
      '\n' + fence + '\n\n'
    )
  }
})

function turndown (text: string): string {
  return turndownService.turndown(text)
}

export { turndown }
