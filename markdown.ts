import { ReadOptions, readHtml } from './html'
import { readMdFromText } from './turndown'

async function readMd (url: string, options?: ReadOptions): Promise<string> {
  const text = await readHtml(url, options)
  if (!text) { return '' }
  return readMdFromText(text.content)
}

export { readMd }
