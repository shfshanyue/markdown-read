import TurndownService from "turndown"

export const filter = (document: Document) => document.URL.startsWith('https://zhuanlan.zhihu')

export const processDocument = (document: Document) => {
  document.querySelectorAll('.Post-Sub, .ContentItem-time').forEach(el => el.remove())
  document.querySelectorAll('.RichText a').forEach(a => {
    const href = a.getAttribute('href')
    if (href?.startsWith('https://link.zhihu')) {
      const url = new URL(href)
      const target = url.searchParams.get('target') || ''
      a.setAttribute('href', target)
    }
  })
}

export const turndownPlugins = (turndown: TurndownService) => {}
