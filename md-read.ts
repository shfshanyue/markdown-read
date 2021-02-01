import { ReadOptions, read } from './read'
import { readMdFromText } from './md-read-text'


async function readMd (url: string, options?: ReadOptions): Promise<string> {
  const text = await read(url, options)
  if (!text) { return '' }
  return readMdFromText(text.content)
}

export { readMd }
