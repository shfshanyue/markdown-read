import TurndownService from "turndown"

export const filter = (document: Document) => document.URL.startsWith('https://juejin')

export const processDocument = (document: Document) => {
  document.querySelectorAll('.copy-code-btn').forEach(btn => btn.remove())
}

export const turndownPlugins = (turndown: TurndownService) => {}
