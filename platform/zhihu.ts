import TurndownService from "turndown"

export const filter = (document: Document) => document.URL.startsWith('https://zhuanlan.zhihu')

export const processDocument = (document: Document) => {
  document.querySelectorAll('.Post-Sub, .ContentItem-time').forEach(el => el.remove())
}

export const turndownPlugins = (turndown: TurndownService) => {}
