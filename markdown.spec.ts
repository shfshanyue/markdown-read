import { readability, markdown, turndown, getDocument } from './src'
import { describe, it, expect } from 'vitest'

describe('markdown', function () {
  it('expect readability work', async () => {
    const doc = await getDocument('https://juejin.cn/post/6922229465468633095')
    const r = await readability(doc)
    expect(r?.title).to.eq('山月最近的面试总结 - 掘金')
    expect(r?.byline).to.eq('程序员山月')
  })

  it('expect markdown work', async () => {

    const r = await markdown('https://juejin.cn/post/6922229465468633095')
    expect(r?.markdown).to.length.gt(100)
  })

  it('expect read markdown from html work', async () => {
    const r = turndown('<h1>hello, world</h1>')
    expect(r).to.eq('# hello, world')
  })

  it('expect read markdown from node weekly', async () => {
    const r = await markdown('https://nodeweekly.com/issues/522')
    expect(r?.title).to.eq('Node Weekly Issue 522: February 27, 2024')
  })
})
