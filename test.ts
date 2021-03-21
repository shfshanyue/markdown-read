import { describe, it } from 'mocha'
import { expect } from 'chai'

import { readHtml, readMd, readMdFromText } from '.'

describe('readHtml', function () {
  this.timeout(60000)

  it('expect readHtml work', async () => {

    const r = await readHtml('https://juejin.cn/post/6922229465468633095')
    expect(r?.title).to.eq('山月最近的面试总结')
  })

  it('expect readMarkdown work', async () => {

    const r = await readMd('https://www.markdownguide.org/basic-syntax')
    expect(r).to.length.gt(100)
  })

  it('expect readMarkdown from mp.weixin work', async () => {

    const r = await readMd('https://mp.weixin.qq.com/s/1Ze6aUAHNcWH9bVAhukaJg')
    // expect(r).to.length.gt(100)
  })

  it('expect readMarkdown from html work', async () => {

    const r = await readMdFromText('<h1>hello, world</h1>')
    console.log(r)
    expect(r).to.eq('# hello, world')
  })
})
