import { JSDOM } from 'jsdom'
import { readability, markdown, turndown, getDocument, TurndownOptions, MarkdownOptions } from '../src'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import TurndownService from 'turndown'

describe('readability', () => {
  let mockDocument: Document

  beforeEach(() => {
    const dom = new JSDOM()
    global.document = dom.window.document
    mockDocument = document.implementation.createHTMLDocument()
    mockDocument.body.innerHTML = `
      <h1>Test Title</h1>
      <p>Test content</p>
      <img src="lazy.jpg" data-src="actual.jpg" class="lazy">
    `
  })

  it('expect readability work', async () => {
    const doc = await getDocument('https://juejin.cn/post/6922229465468633095')
    const r = await readability(doc)
    expect(r?.title).to.eq('山月最近的面试总结提供一个较少提过的方法，使用 grid，它是做二维布局的，但是只有一个子元素时，一维布局与二维布局就一 - 掘金')
    expect(r?.byline).to.eq('程序员山月')
  })

  it('should handle lazy-loaded images', async () => {
    const result = await readability(mockDocument)
    expect(result?.content).to.include('src="actual.jpg"')
  })

  it('should extract byline from meta tag', async () => {
    const metaTag = mockDocument.createElement('meta')
    metaTag.setAttribute('itemprop', 'name')
    metaTag.setAttribute('content', 'Test Author')
    mockDocument.head.appendChild(metaTag)

    const result = await readability(mockDocument)
    expect(result?.byline).to.eq('Test Author')
  })

  it('should return full HTML content when platform skip is true', async () => {
    vi.mock('../src/platform/index', () => ({
      platforms: [{
        filter: () => true,
        skip: true,
        processDocument: vi.fn()
      }]
    }))

    const result = await readability(mockDocument)
    expect(result?.content).to.include('<h1>Test Title</h1>')
    expect(result?.content).to.include('<p>Test content</p>')
  })

})

describe('markdown', function () {
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

  it('expect markdown function to return correct URL', async () => {
    const testUrl = 'https://example.com'
    const r = await markdown(testUrl)
    expect(r).not.to.be.null
    expect(r?.url).to.eq(testUrl)
  })

  it('should use custom TurndownOptions when provided', async () => {
    const testUrl = 'https://example.com'
    const mockHtml = `
      <html>
        <body>
          <h1>Test Title</h1>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
        </body>
      </html>
    `
    const customFetcher = vi.fn().mockResolvedValue(mockHtml)
    
    const customOptions: MarkdownOptions = {
      headingStyle: 'setext',
      bulletListMarker: '*',
      fetcher: customFetcher
    }

    const r = await markdown(testUrl, customOptions)
    
    expect(customFetcher).toHaveBeenCalledWith(testUrl)
    expect(r).not.to.be.null
    expect(r?.markdown).to.include('Test Title\n=========')
    expect(r?.markdown).to.include('*   List item 1')
    expect(r?.markdown).to.include('*   List item 2')
  })

  it('should use underscore as bullet list marker when specified', async () => {
    const testUrl = 'https://example.com'
    const mockHtml = `
      <html>
        <body>
          <h1>Test Title</h1>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
        </body>
      </html>
    `
    const customFetcher = vi.fn().mockResolvedValue(mockHtml)
    
    const customOptions: MarkdownOptions = {
      bulletListMarker: '+',
      fetcher: customFetcher
    }

    const r = await markdown(testUrl, customOptions)
    
    expect(customFetcher).toHaveBeenCalledWith(testUrl)
    expect(r).not.to.be.null
    expect(r?.markdown).to.include('+   List item 1')
    expect(r?.markdown).to.include('+   List item 2')
  })

  it('should include length property in MarkdownContent', async () => {
    const testUrl = 'https://example.com'
    const r = await markdown(testUrl)
    expect(r).not.to.be.null
    expect(r?.length).to.be.a('number')
    expect(r?.length).to.equal(r?.markdown.length)
  })

  it('should use custom headers when provided', async () => {
    const testUrl = 'https://httpbin.org/headers'
    const customHeaders = { 'X-Custom-Header': 'Test' }
    const r = await markdown(testUrl, { headers: customHeaders })
    expect(r).not.to.be.null
    expect(r?.markdown).to.include('X-Custom-Header')
    expect(r?.markdown).to.include('Test')
  })

  it('should use custom fetcher when provided', async () => {
    const testUrl = 'https://example.com'
    const mockHtml = '<html><body><h1>Custom Fetcher Test</h1></body></html>'
    const customFetcher = vi.fn().mockResolvedValue(mockHtml)
    
    const r = await markdown(testUrl, { fetcher: customFetcher })
    
    expect(customFetcher).toHaveBeenCalledWith(testUrl)
    expect(r).not.to.be.null
    expect(r?.markdown).to.include('# Custom Fetcher Test')
  })
})

describe('getDocument', () => {
  it('should fetch and parse HTML document', async () => {
    const doc = await getDocument('https://example.com')
    expect(doc.querySelector('title')?.textContent).to.eq('Example Domain')
  })

  it('should use custom headers when provided', async () => {
    const customHeaders = { 'X-Custom-Header': 'Test' }
    const doc = await getDocument('https://httpbin.org/headers', { headers: customHeaders })
    const responseBody = JSON.parse(doc.body.textContent || '{}')
    expect(responseBody.headers['X-Custom-Header']).to.eq('Test')
  })

  it('should use default User-Agent when no headers provided', async () => {
    const doc = await getDocument('https://httpbin.org/user-agent')
    const responseBody = JSON.parse(doc.body.textContent || '{}')
    expect(responseBody['user-agent']).to.include('Googlebot')
  })

  it('should use custom fetcher when provided', async () => {
    const mockHtml = '<html><body><h1>Custom Fetcher Test</h1></body></html>'
    const customFetcher = vi.fn().mockResolvedValue(mockHtml)
    
    const doc = await getDocument('https://example.com', { fetcher: customFetcher })
    
    expect(customFetcher).toHaveBeenCalledWith('https://example.com')
    expect(doc.querySelector('h1')?.textContent).to.eq('Custom Fetcher Test')
  })
})