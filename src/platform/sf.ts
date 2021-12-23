import TurndownService from "turndown"

export const filter = (document: Document) => document.URL.startsWith('https://segmentfault')

export const processDocument = (document: Document) => {
  document.querySelectorAll('pre > code').forEach(code => code.className = `language-${code.className}`)
}

export const turndownPlugins = (turndown: TurndownService) => {}
