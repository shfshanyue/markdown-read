import TurndownService from "turndown"

export const filter = (document: Document) => document.URL.startsWith('https://mp.weixin')

export const processDocument = (document: Document) => {
  document.querySelectorAll('pre > code').forEach(code => {
    // maybe mdnice format
    code.innerHTML = code.innerHTML.replace(/<br>/g, '\n')
    code.innerHTML = (code as any).innerText || code.innerHTML
  })
}

export const turndownPlugins = (turndown: TurndownService) => {}
