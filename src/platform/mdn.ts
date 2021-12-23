import TurndownService from "turndown"

export const filter = (document: Document) => document.URL.startsWith('https://developer.mozilla')

export const processDocument = (document: Document) => {
  document.body.innerHTML = document.querySelector('article')?.innerHTML.replace(/\b(dl|dt)\b/g, 'div') || ''
  document.querySelectorAll('h1, h2, h3').forEach(head => {
    head.innerHTML = head.textContent || ''
  })
}

export const turndownPlugins = (turndown: TurndownService) => {}

export const skip = true