import { ReadOptions, getDocument } from './document'
import { readability } from './readability'
import { turndown } from './turndown'

interface MarkdownContent {
  markdown: string;
  content: string;
  title: string;
  byline: string;
}

async function markdown(url: string, options?: ReadOptions): Promise<MarkdownContent | null> {
  let doc
  if (process.env.BROWSER) {
    doc = document
  } else {
    doc = await getDocument(url, options)
  }
  const data = readability(doc)
  if (!data) { return null }
  return {
    markdown: turndown(data.content),
    ...data
  }
}

export { markdown }
