import { ReadOptions, readHtml } from './html'
import { turndown } from './turndown'

async function readMd (url: string, options?: ReadOptions): Promise<string> {
  const text = await readHtml(url, options)
  if (!text) { return '' }
  return turndown(text.content)
}

export { readMd }
