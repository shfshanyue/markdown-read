import { describe, it } from 'mocha'
import { expect } from 'chai'

import { readability, markdown, turndown, getDocument } from '.'

describe('markdown', function () {
  this.timeout(60000)

  it('expect readability work', async () => {
    const doc = await getDocument('https://juejin.cn/post/6922229465468633095')
    const r = readability(doc)
    expect(r?.title).to.eq('山月最近的面试总结 - 掘金')
    expect(r?.byline).to.eq('shanyue')
  })

  it('expect markdown work', async () => {

    const r = await markdown('https://www.markdownguide.org/basic-syntax')
    expect(r?.markdown).to.length.gt(100)
  })

  it('expect read markdown from html work', async () => {
    const r = turndown('<h1>hello, world</h1>')
    expect(r).to.eq('# hello, world')
  })
})
