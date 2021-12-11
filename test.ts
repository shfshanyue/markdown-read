import { describe, it } from 'mocha'
import { expect } from 'chai'

import { readHtml, readMd, turndown } from '.'

describe('readHtml', function () {
  this.timeout(60000)

  it('expect readHtml work', async () => {

    const r = await readHtml('https://juejin.cn/post/6922229465468633095')
    expect(r?.title).to.eq('山月最近的面试总结 - 掘金')
  })

  it('expect read markdown from url work', async () => {

    const r = await readMd('https://www.markdownguide.org/basic-syntax')
    expect(r).to.length.gt(100)
  })

  it('expect read markdown from html work', async () => {

    const r = await turndown('<h1>hello, world</h1>')
    console.log(r)
    expect(r).to.eq('# hello, world')
  })
})
