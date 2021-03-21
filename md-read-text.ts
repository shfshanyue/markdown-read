import prettier from 'prettier'
import TurndownService from 'turndown'
import { LANGUAGES, LANGUAGES_FOR_PRETTIER } from './language'

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
    const parser = (LANGUAGES_FOR_PRETTIER as any)[language]
    
    // console.log('---', language, parser)

    let codeParsed
    try {
      if (!parser) throw Error('no parser')
      codeParsed = prettier.format(code, {
        parser
      })
    } catch (e) {
      codeParsed = code.replace(/\n$/, '')

      if (e.message !== 'no parser') {
        // console.log(node.textContent)
        // console.log(e)
      }
    }

    // console.log(codeParsed)

    return (
      '\n\n' + fence + ' ' + language + '\n' +
      codeParsed +
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
