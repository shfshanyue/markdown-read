import TurndownService from "turndown"

export const filter = (document: Document) => document.URL.startsWith('https://juejin')

export const processDocument = (document: Document) => {
  // document.body.replaceWith(document.querySelector('.article-content') || '')
  document.querySelectorAll('.copy-code-btn').forEach(btn => btn.remove())
  document.querySelectorAll('.markdown-body a').forEach(a => {
    const href = a.getAttribute('href')
    if (href?.startsWith('https://link.juejin')) {
      const url = new URL(href)
      const target = url.searchParams.get('target') || ''
      a.setAttribute('href', target)
    }
  })
  document.body.innerHTML = document.querySelector('.markdown-body')?.innerHTML || ''
}

export const turndownPlugins = (turndown: TurndownService) => {}
