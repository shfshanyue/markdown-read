import TurndownService from "turndown"

const weekly = [
  'https://nodeweekly.com',
  'https://javascriptweekly.com',
  'https://react.statuscode.com'
]

export const filter = (document: Document, url?: URL) => Boolean(url && weekly.includes(url.origin))

export const processDocument = async (document: Document) => {
  document.body.innerHTML = Array.from(document.querySelectorAll('.desc, ul'), x => x.outerHTML).join('<br>')
}

export const turndownPlugins = (turndown: TurndownService) => {}

export const skip = true