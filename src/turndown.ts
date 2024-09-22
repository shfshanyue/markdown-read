import TurndownService from 'turndown'
import { detectLanguage } from './language'

const { tables } = require('turndown-plugin-gfm')

function getTextWithLineBreaks(node: HTMLElement): string {
  let text = '';
  for (const childNode of node.childNodes) {
    if (childNode.nodeType === 3) {
      // NODE.TEXT_NODE
      text += childNode.textContent;
    } else if (childNode.nodeName === 'BR') {
      text += '\n';
    } else if (childNode.nodeType === 1) {
      // NODE.ELEMENT_NODE
      text += getTextWithLineBreaks(childNode as HTMLElement);
    }
  }
  return text;
}

function addCustomRules(service: TurndownService) {
  service.addRule('fencedCodeBlockWithCodeElement', {
    filter(node, options) {
      return Boolean(
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE'
      )
    },

    replacement(content, node, options) {
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

  service.addRule('fencedCodeBlockWithoutCodeElement', {
    filter(node, options) {
      return Boolean(
        options.codeBlockStyle === 'fenced' &&
        node.nodeName === 'PRE' &&
        node.firstChild?.nodeName !== 'CODE'
      )
    },

    replacement(content, node, options) {
      node = node as HTMLElement
      const className = [node.className, node.firstElementChild?.className, node.parentElement?.className].join(' ')
      const language = node.dataset?.language || node.dataset?.lang || node.getAttribute('data-language') || node.getAttribute('data-lang') || detectLanguage(className)
      const code = getTextWithLineBreaks(node) || ''
      const fence = options.fence

      return (
        '\n\n' + fence + language + '\n' +
        code.replace(/\n$/, '') +
        '\n' + fence + '\n\n'
      )
    }
  })

}

export type TurndownOptions = TurndownService.Options

export function turndown(text: string, options?: TurndownOptions): string {
  const customTurndownService = new TurndownService({
    emDelimiter: '*',
    codeBlockStyle: 'fenced',
    fence: '```',
    headingStyle: 'atx',
    bulletListMarker: '+',
    ...options
  })

  customTurndownService.use([tables]);
  addCustomRules(customTurndownService);
  return customTurndownService.turndown(text);
}
